package com.mgmtp.a12.template.server.attachment;

import com.mgmtp.a12.dataservices.common.exception.InvalidInputException;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

import static com.mgmtp.a12.dataservices.exception.ExceptionKeys.ATTACHMENT_INVALID_TYPE_ERROR_KEY;

@Component
public class MimeTypeValidator {
    @Value("${mgmtp.a12.template.server.attachment.allowedMimeTypes:*}")
    private String[] allowedMimeTypes;

    public void validateMimeType(byte[] bytes, String filename) {
        List<String> mimeTypesList = Arrays.asList(allowedMimeTypes);

        Tika tika = new Tika();
        String detectedMimeType = tika.detect(bytes, filename);
        String detectedMimeGroup = detectedMimeType.substring(0, detectedMimeType.indexOf('/') + 1) + '*';

        if (!mimeTypesList.contains("*") && !mimeTypesList.contains(detectedMimeGroup)
                && !mimeTypesList.contains(detectedMimeType)) {
            throw new InvalidInputException(ATTACHMENT_INVALID_TYPE_ERROR_KEY, "Invalid MIME type.");
        }
    }
}
