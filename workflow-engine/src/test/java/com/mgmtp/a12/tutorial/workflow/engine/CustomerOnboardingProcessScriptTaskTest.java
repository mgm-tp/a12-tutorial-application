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

package com.mgmtp.a12.tutorial.workflow.engine;

import org.cibseven.bpm.engine.ProcessEngine;
import org.cibseven.bpm.engine.runtime.ProcessInstanceWithVariables;
import org.cibseven.bpm.engine.test.Deployment;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.entry;

@Deployment(resources = "bpmn/CustomerOnboardingProcess.bpmn")
public class CustomerOnboardingProcessScriptTaskTest extends AbstractProcessEngineTest {

    private static ProcessInstanceWithVariables executeAssignSalesRepScriptTask(ProcessEngine processEngine, String customerType) {
        return processEngine.getRuntimeService()
                .createProcessInstanceByKey("CustomerOnboardingProcess")
                .startBeforeActivity("assignSalesRepActivity")
                .setVariableLocal("customerType", customerType)
                .executeWithVariablesInReturn();
    }

    @Test
    void givenVip_shouldAssignVipSalesRep(ProcessEngine processEngine) {
        // given
        String customerType = "vip";

        // when
        var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);

        // then
        assertThat(processInstance.getVariables()).contains(entry("salesRep", "vip@acme.org"));
    }

    @ParameterizedTest
    @ValueSource(strings = { "partner", "lead" })
    void givenNonVip_shouldAssignRegularSalesRep(String customerType, ProcessEngine processEngine) {
        // when
        var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);

        // then
        assertThat(processInstance.getVariables()).contains(entry("salesRep", "sales@acme.org"));
    }

    @ParameterizedTest
    @ValueSource(strings = { "inactive", "suspended" })
    void givenInactiveOrSuspended_shouldAssignNoSalesRep(String customerType, ProcessEngine processEngine) {
        // when
        var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);

        // then
        assertThat(processInstance.getVariables()).contains(entry("salesRep", null));
    }
}
