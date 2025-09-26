package com.mgmtp.a12.workflows.tutorial.worker.generategiftcard;

import org.cibseven.bpm.client.spring.annotation.ExternalTaskSubscription;
import org.cibseven.bpm.client.task.ExternalTask;
import org.cibseven.bpm.client.task.ExternalTaskHandler;
import org.cibseven.bpm.client.task.ExternalTaskService;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.UUID;

@Configuration
@ExternalTaskSubscription("GENERATE_GIFT_CARD")
public class GenerateGiftCardHandler implements ExternalTaskHandler {

    @Override
    public void execute(ExternalTask externalTask, ExternalTaskService externalTaskService) {

        String giftCardCode = "VIP-" + UUID.randomUUID();

        externalTaskService.complete(externalTask, Collections.singletonMap("giftCardCode", giftCardCode));

        LoggerFactory.getLogger(GenerateGiftCardHandler.class).info("Generated gift card: {}", giftCardCode);
    }
}