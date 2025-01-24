package com.mgmtp.a12.tutorial.server.event;

import org.springframework.stereotype.Component;

import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.common.events.ContentTypeDetectedEvent;
import com.mgmtp.a12.tutorial.server.attachment.MimeTypeValidator;

@Component
public class AttachmentEventListener {
    private final MimeTypeValidator mimeTypeValidator;

    public AttachmentEventListener(MimeTypeValidator mimeTypeValidator) {
        this.mimeTypeValidator = mimeTypeValidator;
    }

    @CommonDataServicesEventListener
    public void onContentTypeDetection(ContentTypeDetectedEvent event) {
        mimeTypeValidator.validateMimeType(event.getDetectedMimeType());
    }
}
