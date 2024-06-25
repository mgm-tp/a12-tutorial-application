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
import com.opencagedata.jopencage.model.JOpenCageResponse;
import com.opencagedata.jopencage.model.JOpenCageResult;
import com.mgmtp.a12.kernel.md.document.apiV2.DocumentPointer;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import com.mgmtp.a12.tutorial.server.BaseTest;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_ADDRESS_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AddressValidatorTest extends BaseTest {

    private AddressValidator addressValidator;

    private DocumentV2 documentWithAddress;

    @Mock
    private JOpenCageGeocoder jOpenCageGeocoder;

    @SneakyThrows
    @BeforeEach
    public void setUp() {
        super.setUp("src/test/resources/models/" + CONTACT_MODEL_NAME + ".json");

        documentWithAddress = convertJsonToDocument(basePath + "ContactWithAddress.json");

        addressValidator = new AddressValidator(jOpenCageGeocoder);
    }

    @Test
    public void throwExceptionForNonExistingAddress() throws IOException {
        DocumentV2 documentWithInvalidAddress = convertJsonToDocument(basePath + "ContactWithNonExistingAddress.json");

        JOpenCageResponse jOpenCageResponse = mock(JOpenCageResponse.class);
        when(jOpenCageResponse.getResults()).thenReturn(Collections.emptyList());
        when(jOpenCageGeocoder.forward(any())).thenReturn(jOpenCageResponse);

        assertThrows(InvalidAddressException.class, () -> {
            addressValidator.validateAddress(documentWithInvalidAddress);
        });
    }

    @Test
    public void throwExceptionForMultipleAddressesAndOneInvalid() throws IOException {
        DocumentV2 documentWithInvalidAddress = convertJsonToDocument(basePath + "ContactWithInvalidAddresses.json");

        assertThrows(InvalidAddressException.class, () -> {
            addressValidator.validateAddress(documentWithInvalidAddress);
        });
    }

    @Test
    public void throwExceptionForNumberInCountry() {
        DocumentPointer pointer = DocumentPointer.of(CONTACT_ADDRESS_PATH + "/Country");
        DocumentV2 newDocumentWithAddress = documentWithAddress.withFieldValue(
                pointer,
                getFieldValue(documentWithAddress, pointer) + "1"
        );
        assertThrows(InvalidAddressException.class, () -> {
            addressValidator.validateAddress(newDocumentWithAddress);
        });
    }

    @Test
    public void throwExceptionForNumberInCity() {
        DocumentPointer pointer = DocumentPointer.of(CONTACT_ADDRESS_PATH + "/City");
        DocumentV2 newDocumentWithAddress = documentWithAddress.withFieldValue(
                pointer,
                getFieldValue(documentWithAddress, pointer) + "1"
        );
        assertThrows(InvalidAddressException.class, () -> {
            addressValidator.validateAddress(newDocumentWithAddress);
        });
    }

    @Test
    public void throwExceptionForInvalidStartingLetterInCountry() {
        DocumentPointer pointer = DocumentPointer.of(CONTACT_ADDRESS_PATH + "/Country");
        DocumentV2 newDocumentWithAddress = documentWithAddress.withFieldValue(
                pointer,
                "#" + getFieldValue(documentWithAddress, pointer)
        );
        assertThrows(InvalidAddressException.class, () -> {
            addressValidator.validateAddress(newDocumentWithAddress);
        });
    }

    @Test
    public void throwExceptionForInvalidStartingLetterInStreet() {
        DocumentPointer pointer = DocumentPointer.of(CONTACT_ADDRESS_PATH + "/Street");
        DocumentV2 newDocumentWithAddress = documentWithAddress.withFieldValue(
                pointer,
                "#" + getFieldValue(documentWithAddress, pointer)
        );
        assertThrows(InvalidAddressException.class, () -> {
            addressValidator.validateAddress(newDocumentWithAddress);
        });
    }

    @Test
    public void throwExceptionForInvalidZip() {
        DocumentPointer pointer = DocumentPointer.of(CONTACT_ADDRESS_PATH + "/Zip");
        DocumentV2 newDocumentWithAddress = documentWithAddress.withFieldValue(pointer, "1234567");
        assertThrows(InvalidAddressException.class, () -> {
            addressValidator.validateAddress(newDocumentWithAddress);
        });
    }

    @Test
    public void validAddress() {
        JOpenCageResponse jOpenCageResponse = mock(JOpenCageResponse.class);
        JOpenCageResult jOpenCageResult = mock(JOpenCageResult.class);
        when(jOpenCageResponse.getResults()).thenReturn(List.of(jOpenCageResult));
        when(jOpenCageGeocoder.forward(any())).thenReturn(jOpenCageResponse);

        addressValidator.validateAddress(documentWithAddress);
    }
}
