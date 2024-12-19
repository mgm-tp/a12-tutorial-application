package com.mgmtp.a12.tutorial.server.addressvalidation;

import com.byteowls.jopencage.JOpenCageGeocoder;
import com.byteowls.jopencage.model.JOpenCageResponse;
import com.byteowls.jopencage.model.JOpenCageResult;
import com.mgmtp.a12.kernel.md.document.api.IDocument;
import com.mgmtp.a12.kernel.md.document.api.IFieldInstance;
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

    private IDocument documentWithAddress;

    @Mock
    private JOpenCageGeocoder jOpenCageGeocoder;

    @SneakyThrows
    @BeforeEach
    public void setUp() {
        super.setUp("src/test/resources/models/" + CONTACT_MODEL_NAME + ".json");

        documentWithAddress = convertJsonToDocument(basePath + "ContactWithAddress.json");

        addressValidator = new AddressValidator(documentServiceFactory, jOpenCageGeocoder);
    }

    @Test
    public void throwExceptionForNonExistingAddress() throws IOException {
        assertThrows(InvalidAddressException.class, () -> {
            IDocument documentWithInvalidAddress = convertJsonToDocument(basePath + "ContactWithNonExistingAddress.json");

            JOpenCageResponse jOpenCageResponse = mock(JOpenCageResponse.class);
            when(jOpenCageResponse.getResults()).thenReturn(Collections.emptyList());
            when(jOpenCageGeocoder.forward(any())).thenReturn(jOpenCageResponse);

            addressValidator.validateAddress(documentWithInvalidAddress);
        });
    }

    @Test
    public void throwExceptionForMultipleAddressesAndOneInvalid() throws IOException {
        assertThrows(InvalidAddressException.class, () -> {
            IDocument documentWithInvalidAddress = convertJsonToDocument(basePath + "ContactWithInvalidAddresses.json");

            addressValidator.validateAddress(documentWithInvalidAddress);
        });
    }

    @Test
    public void throwExceptionForNumberInCountry() {
        assertThrows(InvalidAddressException.class, () -> {
            IFieldInstance fieldInstance = getFieldInstanceForPath(documentWithAddress, CONTACT_ADDRESS_PATH + "/Country");
            fieldInstance.setValue(getFieldValue(fieldInstance) + "1");

            addressValidator.validateAddress(documentWithAddress);
        });
    }

    @Test
    public void throwExceptionForNumberInCity() {
        assertThrows(InvalidAddressException.class, () -> {
            IFieldInstance fieldInstance = getFieldInstanceForPath(documentWithAddress, CONTACT_ADDRESS_PATH + "/City");
            fieldInstance.setValue(getFieldValue(fieldInstance) + "1");

            addressValidator.validateAddress(documentWithAddress);
        });
    }

    @Test
    public void throwExceptionForInvalidStartingLetterInCountry() {
        assertThrows(InvalidAddressException.class, () -> {
            IFieldInstance fieldInstance = getFieldInstanceForPath(documentWithAddress, CONTACT_ADDRESS_PATH + "/Country");
            fieldInstance.setValue("#" + getFieldValue(fieldInstance));

            addressValidator.validateAddress(documentWithAddress);
        });
    }

    @Test
    public void throwExceptionForInvalidStartingLetterInStreet() {
        assertThrows(InvalidAddressException.class, () -> {
            IFieldInstance fieldInstance = getFieldInstanceForPath(documentWithAddress, CONTACT_ADDRESS_PATH + "/Street");
            fieldInstance.setValue("#" + getFieldValue(fieldInstance));

            addressValidator.validateAddress(documentWithAddress);
        });
    }

    @Test
    public void throwExceptionForInvalidZip() {
        assertThrows(InvalidAddressException.class, () -> {
            IFieldInstance fieldInstance = getFieldInstanceForPath(documentWithAddress, CONTACT_ADDRESS_PATH + "/Zip");
            fieldInstance.setValue("1234567");

            addressValidator.validateAddress(documentWithAddress);
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
