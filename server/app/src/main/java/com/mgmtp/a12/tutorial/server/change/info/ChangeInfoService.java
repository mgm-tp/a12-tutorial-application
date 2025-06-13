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

package com.mgmtp.a12.tutorial.server.change.info;

import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import com.mgmtp.a12.tutorial.server.utils.ChangeInfoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChangeInfoService {

    private final ChangeInfoUtils changeInfoUtils;

    /**
     * If the document is instantiated from `Contact_Dc`, sets the creation information (<code>createdAt</code> and
     * <code>createdBy</code>) for the given document.
     *
     * @param document the document based on which the creation information should be set.
     * @return the updated document with creation information set.
     */
    public DocumentV2 setCreationInfo(DocumentV2 document) {
        // Put your code here ...
        return null;
    }

    /**
     * If the document is instantiated from `Contact_Dc`,
     * <ul>
     *     <li>removes the history entries older than 1 year,</li>
     *     <li>updates the modification information, if there are relevant changes.</li>
     * </ul>
     *
     * @param updatedDocument   the document which potentially contains changes.
     * @param persistedDocument the document which comes from the database (this is the reference document).
     * @return the updated document with the modification information set (if applicable).
     */
    public DocumentV2 updateModificationInfo(DocumentV2 updatedDocument, DocumentV2 persistedDocument) {
        // Put your code here ...
        return null;
    }
}
