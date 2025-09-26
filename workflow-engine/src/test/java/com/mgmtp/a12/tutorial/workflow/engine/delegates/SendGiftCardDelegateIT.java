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

package com.mgmtp.a12.tutorial.workflow.engine.delegates;

import org.cibseven.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.web.client.RestTemplate;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@Testcontainers
@SpringBootTest
class SendGiftCardDelegateIT {

    private final SendGiftCardDelegate delegate;
    private static final DelegateExecution mockExecution = mock(DelegateExecution.class);

    @Autowired
    SendGiftCardDelegateIT(SendGiftCardDelegate delegate) {
        this.delegate = delegate;
    }

    @MockitoSpyBean
    private MailSender mailSender;

    // IMPORTANT: external users must replace the image name with
    // "artifacts.geta12.com/artifactory/a12-docker/maildev/maildev:2.2.1".
    // Keep a maildev 2.x tag rather than "latest": maildev 3.x moved the REST API
    // this test queries from /email to /api/email.
    @Container
    static GenericContainer<?> maildev = new GenericContainer<>("dockerregistry.mgm-tp.com/maildev/maildev:2.2.1")
            .withExposedPorts(1025, 1080)
            .waitingFor(Wait.forListeningPorts(1025, 1080));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.mail.host", maildev::getHost);
        registry.add("spring.mail.port", () -> maildev.getMappedPort(1025));
    }

    @BeforeAll
    static void setUpMocks() {
        when(mockExecution.getVariable("salesRep")).thenReturn("mock@from.com");
        when(mockExecution.getVariable("customerEmail")).thenReturn("mock@value.com");
        when(mockExecution.getVariable("customerFirstName")).thenReturn("Cus");
        when(mockExecution.getVariable("customerLastName")).thenReturn("Tomer");
        when(mockExecution.getVariable("giftCardCode")).thenReturn("VIP-56789");
    }

    @Test
    public void shouldCallMailSender() throws MailException {
        // when
        delegate.execute(mockExecution);

        // then
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void shouldSuccessfullySendEmailToMailServer() throws MailException {
        // given
        String maildevUrl = "http://%s:%d".formatted(maildev.getHost(), maildev.getMappedPort(1080));
        RestTemplate restTemplate = new RestTemplate();

        // when
        delegate.execute(mockExecution);

        // then
        ResponseEntity<String> emailsOnServer = restTemplate.getForEntity(maildevUrl + "/email", String.class);

        assertThat(emailsOnServer.getBody())
                .contains("mock@value.com")
                .contains("Cus")
                .contains("Tomer")
                .contains("VIP-56789");
    }
}
