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

package com.mgmtp.a12.workflows.tutorial.worker.generategiftcard;

import org.cibseven.bpm.client.task.ExternalTask;
import org.cibseven.bpm.client.task.ExternalTaskService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class GenerateGiftCardHandlerTest {

    GenerateGiftCardHandler generateGiftCardHandler = new GenerateGiftCardHandler();

    @Test
    public void shouldGenerateValidGiftCardCode() {
        // given
        var mockExternalTaskService = mock(ExternalTaskService.class);
        var mockExternalTask = mock(ExternalTask.class);
        ArgumentCaptor<Map<String, Object>> variablesCaptor = ArgumentCaptor.captor();

        doNothing().when(mockExternalTaskService).complete(eq(mockExternalTask), any());

        // when
        generateGiftCardHandler.execute(mockExternalTask, mockExternalTaskService);

        // then
        verify(mockExternalTaskService).complete(eq(mockExternalTask), variablesCaptor.capture());
        String capturedCode = (String) variablesCaptor.getValue().get("giftCardCode");

        assertNotNull(capturedCode);
        assertTrue(capturedCode.startsWith("VIP-"));
    }
}
