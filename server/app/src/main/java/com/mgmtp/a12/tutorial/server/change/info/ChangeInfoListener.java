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

import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeCreateEvent;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeUpdateEvent;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Class that represents the collection of event listeners for managing the change information of a document.
 * The goal of this class is to listen for events before creating or modifying documents, in order to extend them
 * with the necessary information.
 */
@Component
@RequiredArgsConstructor
public class ChangeInfoListener {

    private final ChangeInfoService changeInfoService;

    /**
     * Before the document is created, the creation info will be set from the following listener.
     * The creation info includes creation time and creator.
     */
    @CommonDataServicesEventListener
    public void beforeCreateListener(DocumentBeforeCreateEvent event) {
        DocumentV2 newDocument = changeInfoService.setCreationInfo(event.getCreatedDocument());
        event.setCreatedDocument(newDocument);
    }

    /**
     * Before the document is updated, the history entries will be cleaned up (entries older than 1 year will be
     * removed), and the modification info will be set from the following listener.
     * The modification info includes modification time, modifier and change details.
     */
    @CommonDataServicesEventListener
    public void beforeUpdateListener(DocumentBeforeUpdateEvent event) {
        DocumentV2 newDocument = changeInfoService.updateModificationInfo(
                event.getUpdatedDocument(),
                event.getPersistedDocument());
        event.setUpdatedDocument(newDocument);
    }
}
