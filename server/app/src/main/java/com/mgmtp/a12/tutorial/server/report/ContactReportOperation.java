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

package com.mgmtp.a12.tutorial.server.report;

import com.googlecode.jsonrpc4j.JsonRpcParam;
import com.mgmtp.a12.dataservices.rpc.RemoteOperation;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static com.mgmtp.a12.tutorial.server.report.ContactReportOperation.GET_CONTACT_REPORT;

/**
 * This operation is similar to the "LIST_DOCUMENTS" operation, where it collects all the contact data based on the
 * given params.
 */
@Slf4j
@RemoteOperation(name = GET_CONTACT_REPORT)
@Component
@RequiredArgsConstructor
public class ContactReportOperation {

    public static final String GET_CONTACT_REPORT = "GET_CONTACT_REPORT";

    private final ContactReportService contactReportService;

    /**
     * Handles RPC calls to retrieve a list of contacts based on the specified customer type, nationality,
     * and locale language.
     *
     * @param customerType   the type of the customer to filter by (e.g., "Individual", "Business").
     * @param nationality    the nationality of the contacts to filter by (e.g., "German", "British").
     * @param localeLanguage the language code used for localization; must be either "en" or "de".
     * @return a list of {@link Contact} objects matching the specified criteria.
     * @throws IllegalArgumentException if the localeLanguage is not "en" or "de".
     */
    public List<Contact> rpc(@NonNull @JsonRpcParam("customerType") String customerType,
                             @NonNull @JsonRpcParam("nationality") String nationality,
                             @NonNull @JsonRpcParam("localeLanguage") String localeLanguage) {
        log.debug("{} called with parameters [customerType={}, nationality={}, localeLanguage={}]",
                GET_CONTACT_REPORT,
                customerType,
                nationality,
                localeLanguage
        );

        // Put your code here ...
        return new ArrayList<>();
    }
}
