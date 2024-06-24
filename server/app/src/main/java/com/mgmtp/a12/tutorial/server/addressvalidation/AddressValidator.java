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

import com.opencagedata.jopencage.model.JOpenCageForwardRequest;
import com.opencagedata.jopencage.model.JOpenCageResponse;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.GroupInstanceV2;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.RepetitionsV2;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_ADDRESS_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;

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
        if (!CONTACT_MODEL_NAME.equals(document.getDocumentModelId())) {
            return;
        }

        List<AddressProblem> problems = new ArrayList<>();

        List<Address> addresses = getAddressesForDocument(document);

        addresses.stream()
                .filter(address -> checkAddress(address, problems))
                .filter(address -> {
                    JOpenCageForwardRequest request = createJOpenCageForwardRequest(address);
                    JOpenCageResponse response = jOpenCageGeocoder.forward(request);
                    return response != null && response.getResults().isEmpty();
                })
                .forEach(address -> problems.add(
                        new AddressProblem("There is no result for the provided address: '%s'".formatted(address))
                ));

        // Check for problems
        if (!problems.isEmpty()) {
            String errorMsg = problems.stream()
                    .map(AddressProblem::getMessage)
                    .collect(Collectors.joining("] --- [", "[", "]"));
            throw new InvalidAddressException(errorMsg);
        }
    }

    /**
     * Creates a JOpenCageForwardRequest using the given address details.
     *
     * @param address the Address object containing the details needed for the forward request
     * @return a configured JOpenCageForwardRequest object
     */
    private JOpenCageForwardRequest createJOpenCageForwardRequest(Address address) {
        JOpenCageForwardRequest request = new JOpenCageForwardRequest(
                address.getStreet() + " " + address.getHouseNumber(),
                address.getZip(),
                address.getCity(),
                address.getCountry());
        // Confidence represents how accurate the return results should be regarding bounding box size:
        // 10 = < 0.25km distance between southwest and northeast side of box
        // 1 = >= 25km distance between southwest and northeast side of box
        request.setMinConfidence(10);
        request.setNoDedupe(false);
        return request;
    }

    /**
     * A helper method to retrieve all addresses of a document and returns these as a list.
     */
    private List<Address> getAddressesForDocument(DocumentV2 document) {
        List<Address> addresses = new ArrayList<>();

        RepetitionsV2 addressGroupInstances = document.groupAllRepetitions(CONTACT_ADDRESS_PATH + "[0]");

        addressGroupInstances.stream()
                .forEach(addressGroupInstance -> {
                    String street = resolveString(addressGroupInstance, "Street");
                    String houseNumber = resolveString(addressGroupInstance, "Housenumber");
                    String zip = resolveString(addressGroupInstance, "Zip");
                    String city = resolveString(addressGroupInstance, "City");
                    String country = resolveString(addressGroupInstance, "Country");

                    addresses.add(new Address(street, houseNumber, zip, city, country));
                });

        return addresses;
    }

    /**
     * Method for retrieval of the string values in a document.
     */
    private String resolveString(GroupInstanceV2 groupInstance, String fieldName) {
        return Optional.ofNullable(groupInstance.directField(fieldName))
                .map(field -> field.value().toString())
                .orElse("");

    }

    /**
     * Method for executing address validation.
     */
    private boolean checkAddress(Address address, List<AddressProblem> problems) {
        return checkForNumber(address.getCity(), problems)
                & checkForNumber(address.getCountry(), problems)
                & validateStartingLetter("Street", address.getStreet(), problems)
                & validateStartingLetter("Country", address.getCountry(), problems)
                & validateZip(address.getZip(), problems);
    }

    /**
     * Validation to prevent user intentionally putting number in city or country field
     * <p>
     * Valid case: "London", "Macedonia"
     * Invalid case: "L0nd0n", "Mac3d0nia"
     */
    private boolean checkForNumber(String value, List<AddressProblem> problems) {
        if (Pattern.compile("\\d").matcher(value).find()) {
            problems.add(new AddressProblem("Location: '%s' contains a forbidden number!".formatted(value)));
            return false;
        }
        return true;
    }

    /**
     * Validation to prevent user using words starting with special character
     * <p>
     * Valid case: "Poland", "Czechia"
     * Invalid case: "-Belgium", "%England"
     */
    private boolean validateStartingLetter(String fieldName, String value, List<AddressProblem> problems) {
        if (!value.isEmpty() && !Character.isLetter(value.charAt(0))) {
            problems.add(
                    new AddressProblem(
                            "%s: '%s' starts with forbidden letter: '%s'!".formatted(fieldName, value, value.charAt(0)))
            );
            return false;
        }
        return true;
    }

    /**
     * Validation for correct ZIP code format
     * <p>
     * Valid case: "123 456", "123-456", "123456"
     * Invalid case: "1234 4567", "Eng1and"
     */
    private boolean validateZip(String value, List<AddressProblem> problems) {
        if (!Pattern.compile("^\\w{2,3}(-|\\s)?(\\w{2,3})?$").matcher(value).find()) {
            problems.add(new AddressProblem("Invalid ZIP code: '%s' provided!".formatted(value)));
            return false;
        }
        return true;
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
