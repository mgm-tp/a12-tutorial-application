package com.mgmtp.a12.tutorial.workflow.engine.delegates;

import org.cibseven.bpm.engine.RuntimeService;
import org.cibseven.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.ArgumentMatchers.any;

@SpringBootTest
public class SendGiftCardDelegateTest {

    @MockitoBean
    private final SendGiftCardDelegate sendGiftCardDelegate = null;

    @Autowired
    private final RuntimeService runtimeService = null;

    private void executeSendGiftCardServiceTask() {
        this.runtimeService
                .createProcessInstanceByKey("CustomerOnboardingProcess")
                .startBeforeActivity("sendWelcomeGiftCardActivity")
                .execute();
    }

    @Test
    void shouldCallSendGiftCardDelegate() {
        // when
        executeSendGiftCardServiceTask();

        // then
        Mockito.verify(sendGiftCardDelegate).execute(any(DelegateExecution.class));
    }
}
