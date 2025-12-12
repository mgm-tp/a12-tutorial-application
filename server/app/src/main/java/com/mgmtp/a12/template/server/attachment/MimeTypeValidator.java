package com.mgmtp.a12.template.server.attachment;

import com.mgmtp.a12.dataservices.common.exception.InvalidInputException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.mgmtp.a12.dataservices.exception.ExceptionKeys.ATTACHMENT_INVALID_TYPE_ERROR_KEY;

@Component
public class MimeTypeValidator {
    @Value("${mgmtp.a12.template.server.attachment.allowedMimeTypes:*}")
    private List<String> allowedMimeTypes;

    public void validateMimeType(String mimeType) {
        String detectedMimeGroup = mimeType.substring(0, mimeType.indexOf('/') + 1) + '*';

        if (!allowedMimeTypes.contains("*") && !allowedMimeTypes.contains(detectedMimeGroup)
                && !allowedMimeTypes.contains(mimeType)) {
            throw new InvalidInputException(ATTACHMENT_INVALID_TYPE_ERROR_KEY, "Invalid MIME type.");
        }
    }
}
