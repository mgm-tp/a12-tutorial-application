package com.mgmtp.a12.tutorial.workflow.engine.encryption;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProcessVariableEncryptionConfiguration {

    @Bean
    ProcessVariableEncryptionHandler processVariableEncryptionHandler() {
        return new ProcessVariableEncryptionHandler();
    }
}
