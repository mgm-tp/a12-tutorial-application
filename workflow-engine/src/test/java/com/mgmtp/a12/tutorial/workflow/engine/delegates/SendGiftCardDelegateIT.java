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

    // IMPORTANT: mgm-internal users must use image name "dockerregistry.mgm-tp.com/maildev/maildev"
    @Container
    static GenericContainer<?> maildev = new GenericContainer<>("artifacts.geta12.com/artifactory/a12-docker/maildev/maildev")
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
