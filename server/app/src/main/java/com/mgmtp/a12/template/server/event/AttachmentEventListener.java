package com.mgmtp.a12.template.server.event;

import com.mgmtp.a12.dataservices.attachment.DataServicesAttachment;
import com.mgmtp.a12.dataservices.attachment.events.AttachmentBeforeCreateEvent;
import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.common.exception.UnexpectedException;
import com.mgmtp.a12.template.server.attachment.MimeTypeValidator;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Optional;

@Service
public class AttachmentEventListener {
    private final MimeTypeValidator mimeTypeValidator;

    public AttachmentEventListener(MimeTypeValidator mimeTypeValidator) {
        this.mimeTypeValidator = mimeTypeValidator;
    }

    @CommonDataServicesEventListener
    public void beforeCreate(AttachmentBeforeCreateEvent attachmentBeforeCreateEvent) {
        DataServicesAttachment dataServicesAttachment = attachmentBeforeCreateEvent.getAttachment();

        Optional.ofNullable(dataServicesAttachment.getContent())
                .ifPresent(cs -> {
                    try {
                        byte[] buffer = IOUtils.toByteArray(cs.get());
                        mimeTypeValidator.validateMimeType(buffer, dataServicesAttachment.getHeader().getFilename());
                        // Create a new input stream after consuming it because input stream is NOT re-readable
                        dataServicesAttachment.setContent(() -> new ByteArrayInputStream(buffer));
                    } catch (IOException e) {
                        throw new UnexpectedException("Error during before create attachment", e);
                    }
                });
    }
}
