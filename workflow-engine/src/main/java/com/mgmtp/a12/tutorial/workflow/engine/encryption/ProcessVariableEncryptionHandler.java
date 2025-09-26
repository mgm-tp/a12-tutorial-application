package com.mgmtp.a12.tutorial.workflow.engine.encryption;

import com.mgmtp.a12.workflows.engine.internal.serialization.ProcessVariableBeforeDeserializationEvent;
import com.mgmtp.a12.workflows.engine.internal.serialization.ProcessVariableBeforeSerializationEvent;
import org.springframework.context.event.EventListener;

import java.util.Base64;

public class ProcessVariableEncryptionHandler {

    @EventListener
    void handleEncryption(ProcessVariableBeforeSerializationEvent event) {
        // Insert actual encryption logic here for production...

        var encodedValue = Base64.getEncoder().encodeToString(event.getVariable().getBytes());

        event.setVariable(encodedValue);
    }

    @EventListener
    void handleDecryption(ProcessVariableBeforeDeserializationEvent event) {
        byte[] decodedBytes = Base64.getDecoder().decode(event.getVariable());

        // Insert actual decryption logic here for production...

        event.setVariable(new String(decodedBytes));
    }
}
