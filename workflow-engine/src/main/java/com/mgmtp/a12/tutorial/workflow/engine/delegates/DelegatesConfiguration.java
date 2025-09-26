package com.mgmtp.a12.tutorial.workflow.engine.delegates;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.MailSender;

@Configuration
public class DelegatesConfiguration {

    @Bean
    public SendGiftCardDelegate sendGiftCardDelegate(MailSender mailSender) {
        return new SendGiftCardDelegate(mailSender);
    }
}
