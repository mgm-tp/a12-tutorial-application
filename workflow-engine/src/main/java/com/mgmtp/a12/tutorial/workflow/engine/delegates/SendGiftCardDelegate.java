package com.mgmtp.a12.tutorial.workflow.engine.delegates;

import org.cibseven.bpm.engine.delegate.DelegateExecution;
import org.cibseven.bpm.engine.delegate.JavaDelegate;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;

public class SendGiftCardDelegate implements JavaDelegate {

    private final MailSender mailSender;

    public SendGiftCardDelegate(MailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void execute(DelegateExecution execution) throws MailException {
        var fromEmail = execution.getVariable("salesRep").toString();
        var customerEmail = execution.getVariable("customerEmail").toString();
        var customerFirstName = execution.getVariable("customerFirstName").toString();
        var customerLastName = execution.getVariable("customerLastName").toString();
        var giftCardCode = execution.getVariable("giftCardCode").toString();

        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom(fromEmail);
        email.setTo(customerEmail);
        email.setSubject("Your welcome gift from ACME");
        email.setText("""
                        Dear %s %s,
                
                        As a little welcome gift, you can redeem the following gift card in our shop: %s
                """.formatted(customerFirstName, customerLastName, giftCardCode));

        this.mailSender.send(email);
    }
}