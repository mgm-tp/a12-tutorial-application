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

import com.opencagedata.jopencage.JOpenCageGeocoder;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AddressValidator {

    private final JOpenCageGeocoder jOpenCageGeocoder;

    /**
     * Checker for input document that has to determine if document is of `Contact_DM` model name. In case of true,
     * validation should validate address by calling method implementing validation logic.
     * If validation fails custom exception is thrown affecting the response.
     * <p>
     * If internal validation goes through, OpenCage Geocoding API is used to search for the entered location. Then the
     * response will be checked. An exception is thrown when there has been no address.
     */
    public void validateAddress(DocumentV2 document) {
        // Put your code here ...
    }

    @Data
    @AllArgsConstructor
    private static class Address {
        private String street;
        private String houseNumber;
        private String zip;
        private String city;
        private String country;

        @Override
        public String toString() {
            return "{%s %s, %s %s, %s}".formatted(street, houseNumber, zip, city, country);
        }
    }
}
