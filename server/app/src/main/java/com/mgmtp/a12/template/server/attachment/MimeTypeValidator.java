/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (C) 2012-2025 mgm technology partners GmbH
 * All rights reserved. Rights of use are granted under the selected license.
 *
 * Dual License
 * ------------
 * This file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
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
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

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
