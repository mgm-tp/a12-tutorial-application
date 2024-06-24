package com.mgmtp.a12.tutorial.server.addressvalidation;

import com.byteowls.jopencage.JOpenCageGeocoder;
import com.byteowls.jopencage.model.JOpenCageForwardRequest;
import com.byteowls.jopencage.model.JOpenCageResponse;
import com.mgmtp.a12.kernel.md.document.api.IDocument;
import com.mgmtp.a12.kernel.md.document.api.IEntityInstance;
import com.mgmtp.a12.kernel.md.document.api.IFieldInstance;
import com.mgmtp.a12.kernel.md.document.api.services.IDocumentSearchService;
import com.mgmtp.a12.kernel.md.facade.DocumentServiceFactory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_ADDRESS_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;

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
                .forEach(address -> problems
                        .add(new AddressProblem("There is no result for the provided address: '%s'".formatted(address))));

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
    private List<Address> getAddressesForDocument(IDocument document) {
        List<Address> addresses = new ArrayList<>();

        IDocumentSearchService documentSearchService = documentServiceFactory.createDocumentSearchService(document);

        Set<IEntityInstance> entityInstances = document.getEntityInstances();

        entityInstances.stream()
                .filter(entityInstance -> entityInstance.getPath().equals(CONTACT_ADDRESS_PATH))
                .forEach(entityInstance -> {
                    int[] repetitions = entityInstance.getRepetitions();
                    String street = resolveString(documentSearchService, repetitions, CONTACT_ADDRESS_PATH + "/Street");
                    String houseNumber = resolveString(documentSearchService, repetitions, CONTACT_ADDRESS_PATH + "/Housenumber");
                    String zip = resolveString(documentSearchService, repetitions, CONTACT_ADDRESS_PATH + "/Zip");
                    String city = resolveString(documentSearchService, repetitions, CONTACT_ADDRESS_PATH + "/City");
                    String country = resolveString(documentSearchService, repetitions, CONTACT_ADDRESS_PATH + "/Country");

                    addresses.add(new Address(street, houseNumber, zip, city, country));
                });

        return addresses;
    }

    /**
     * Method for retrieval of the string values in a document.
     */
    private String resolveString(IDocumentSearchService documentSearchService, int[] repetitions, String path) {
        Optional<IFieldInstance> iFieldInstance = documentSearchService.get(path, repetitions).stream()
                .findFirst()
                .map(IFieldInstance.class::cast);

        return iFieldInstance
                .flatMap(IFieldInstance::getValue)
                .map(Object::toString)
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
        if (Pattern.compile("[0-9]").matcher(value).find()) {
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
