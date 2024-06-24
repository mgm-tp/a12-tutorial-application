package com.mgmtp.a12.tutorial.server.addressvalidation;

import com.byteowls.jopencage.JOpenCageGeocoder;
import com.mgmtp.a12.kernel.md.document.api.IDocument;
import com.mgmtp.a12.kernel.md.facade.DocumentServiceFactory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AddressValidator {

    private final DocumentServiceFactory documentServiceFactory;
    private final JOpenCageGeocoder jOpenCageGeocoder;

    /**
     * Checker for input document that has to determine if document is of `Contact_DM` model name. In case of true,
     * validation should validate address by calling method implementing validation logic.
     * If validation fails custom exception is thrown affecting the response.
     * <p>
     * If internal validation goes through, OpenCage Geocoding API is used to search for the entered location. Then the
     * response will be checked. An exception is thrown when there has been no address.
     */
    public void validateAddress(IDocument document) {
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
