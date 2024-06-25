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
