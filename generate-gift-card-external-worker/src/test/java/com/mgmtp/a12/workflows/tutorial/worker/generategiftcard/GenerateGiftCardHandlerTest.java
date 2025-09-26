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