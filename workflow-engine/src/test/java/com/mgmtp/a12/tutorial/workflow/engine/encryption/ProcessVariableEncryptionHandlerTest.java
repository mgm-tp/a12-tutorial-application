/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

package com.mgmtp.a12.tutorial.workflow.engine.encryption;

import org.cibseven.bpm.engine.RepositoryService;
import org.cibseven.bpm.engine.RuntimeService;
import org.cibseven.bpm.model.bpmn.Bpmn;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest
class ProcessVariableEncryptionHandlerTest {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private RepositoryService repositoryService;

    @Autowired
    private DataSource dataSource;

    @Test
    public void shouldEncryptProcessVariables() {
        // given
        var processModel = Bpmn.createExecutableProcess("TestProcess")
                .startEvent()
                .scriptTask("createSomeVariable")
                .scriptFormat("javascript")
                .scriptText("execution.setVariable(\"myVariable\", \"sensitive data\")")
                .intermediateCatchEvent("wait")
                .message("someMessage")
                .endEvent()
                .done();

        repositoryService.createDeployment()
                .addModelInstance("TestProcess.bpmn", processModel)
                .deploy();

        // when
        var processInstance = runtimeService.startProcessInstanceByKey("TestProcess");

        // then
        var encodedValueFromDatabase = getVariableFromDatabase(processInstance.getId(), "myVariable");
        assertThat(encodedValueFromDatabase).isNotNull();
        assertThat(encodedValueFromDatabase).isNotEqualTo("sensitive data");

        var decoded = assertDoesNotThrow(() -> Base64.getDecoder().decode(encodedValueFromDatabase));
        var decodedString = new String(decoded);
        assertThat(decodedString).isEqualTo("\"sensitive data\""); // In DB, string is stored as serialized TextNode, thus with quotes.
    }

    private String getVariableFromDatabase(String processInstanceId, String variableName) {
        try (var connection = dataSource.getConnection()) {
            // When enabling encryption/eventing, CIB 7 stores variables as byte arrays
            var variableSql = """
                    SELECT bytearray.BYTES_
                    FROM ACT_RU_VARIABLE variable
                    JOIN ACT_GE_BYTEARRAY bytearray ON variable.BYTEARRAY_ID_ = bytearray.ID_
                    WHERE variable.PROC_INST_ID_ = ? AND variable.NAME_ = ?
                    """;
            try (var stmt = connection.prepareStatement(variableSql)) {
                stmt.setString(1, processInstanceId);
                stmt.setString(2, variableName);
                var resultSet = stmt.executeQuery();
                if (!resultSet.next()) {
                    throw new RuntimeException("No variable found with name: " + variableName);
                }
                byte[] serializedData = resultSet.getBytes("BYTES_");
                return (String) new ObjectInputStream(new ByteArrayInputStream(serializedData)).readObject();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to query database", e);
        }
    }
}
