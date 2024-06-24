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

package com.mgmtp.a12.tutorial.server.addressvalidation;

import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeCreateEvent;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeUpdateEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Class that represents the collection of event listeners utilizing mocked address validators
 * or 3rd party address validators.
 * The goal of this class is to listen for event before creating or modifying documents of model type ContactModel.
 * In case of invalid document, e.g. missing field, custom exception will be thrown.
 * <p>
 * Used Document's events:
 * - DocumentBeforeCreateEvent
 * - DocumentBeforeUpdateEvent
 * <p>
 * For more information about published events by Data Services have a look at the
 * <a href="https://docs.geta12.com">getA12 documentation</a> ("Development > Components > Data Services", section
 * "Java API > Extending the Server > Events > Data Services Events").
 */
@Component
@ConditionalOnProperty(prefix = "mgmtp.a12.tutorial.server", value = "addressValidation", havingValue = "true")
@RequiredArgsConstructor
public class AddressValidationListener {

    private final AddressValidator addressValidator;

    /**
     * Before the document is created the address validation will be executed from the following listener
     */
    @CommonDataServicesEventListener
    public void beforeCreateListener(DocumentBeforeCreateEvent event) {
        addressValidator.validateAddress(event.getCreatedDocument());
    }

    /**
     * Before the document is updated the address validation will be executed from the following listener
     */
    @CommonDataServicesEventListener
    public void beforeUpdateListener(DocumentBeforeUpdateEvent event) {
        addressValidator.validateAddress(event.getUpdatedDocument());
    }

}
