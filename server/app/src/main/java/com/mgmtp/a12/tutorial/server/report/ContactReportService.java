package com.mgmtp.a12.tutorial.server.report;

import com.mgmtp.a12.dataservices.document.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentQueryService;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.model.persistence.IModelLoader;
import com.mgmtp.a12.dataservices.rpc.query.FilterSpec;
import com.mgmtp.a12.dataservices.rpc.query.PageSpec;
import com.mgmtp.a12.dataservices.rpc.query.ResultSet;
import com.mgmtp.a12.dataservices.search.SearchUtils;
import com.mgmtp.a12.kernel.md.document.api.IDocument;
import com.mgmtp.a12.kernel.md.document.api.IFieldInstance;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IFieldTypeDefinition;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ITypeDefType;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_CUSTOMER_TYPE_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_EMAIL_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_FIRSTNAME_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_GENDER_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_LASTNAME_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_NATIONALITY_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PHONES_PHONE_NUMBER_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PHONES_PHONE_TYPE_PATH;
import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toMap;

@Component
@RequiredArgsConstructor
public class ContactReportService {

    private final DocumentQueryService documentQueryService;
    private final IDocumentRepository documentRepository;
    private final DocumentModelServiceFactory documentModelServiceFactory;
    private final IModelLoader<IDocumentModel> documentModelLoader;

    /**
     * Retrieves a list of contacts based on the specified customer type, nationality, and locale language.
     *
     * @param customerType   the type of the customer to filter by (e.g., "lead", "vip").
     * @param nationality    the nationality of the contacts to filter by (e.g., "German", "British").
     * @param localeLanguage the language code used for localization (e.g., "en", "de").
     * @return a list of {@link Contact} objects matching the specified criteria.
     * @throws NoSuchElementException if the document field elements required are not found.
     */
    public List<Contact> getContacts(String customerType, String nationality, String localeLanguage) {
        ResultSet<DocumentReference> queryResult = documentQueryService.query(CONTACT_MODEL_NAME,
                createFilterSpec(customerType, nationality),
                emptyList(),
                PageSpec.MAX_RESULTS,
                emptyList());

        List<DataServicesDocument> contactDocuments = documentRepository.findDocumentsByDocRefs(queryResult.getEntries());

        IDocumentModel documentModel = documentModelLoader.loadModel(CONTACT_MODEL_NAME);
        final IDocumentModelSearchService searchService =
                documentModelServiceFactory.createDocumentModelSearchService(documentModel);
        Map<String, String> genderToLocalizedTextMap =
                buildFieldValueToLocalizedTextMap(searchService, CONTACT_PERSONALDATA_GENDER_PATH, localeLanguage);
        Map<String, String> customerTypeToLocalizedTextMap =
                buildFieldValueToLocalizedTextMap(searchService, CONTACT_PERSONALDATA_CUSTOMER_TYPE_PATH, localeLanguage);
        Map<String, String> phoneTypeToLocalizedTextMap =
                buildFieldValueToLocalizedTextMap(searchService, CONTACT_PHONES_PHONE_TYPE_PATH, localeLanguage);

        return contactDocuments.stream()
                .map(DataServicesDocument::getKernelDocument)
                .map(document -> mapToContact(
                        document,
                        genderToLocalizedTextMap,
                        customerTypeToLocalizedTextMap,
                        phoneTypeToLocalizedTextMap
                ))
                .collect(Collectors.toList());
    }

    /**
     * Creates a filter specification for querying contacts based on customer type and nationality.
     *
     * @param customerType the type of the customer to filter by.
     * @param nationality  the nationality of the contacts to filter by.
     * @return a {@link FilterSpec} object configured with the specified filters.
     */
    private FilterSpec createFilterSpec(String customerType, String nationality) {
        FilterSpec filterSpec = new FilterSpec();
        filterSpec.addFilter(buildFilter(CONTACT_PERSONALDATA_CUSTOMER_TYPE_PATH, customerType));
        filterSpec.addFilter(buildFilter(CONTACT_PERSONALDATA_NATIONALITY_PATH, nationality));
        // Do not provide any language here. Otherwise, enumeration filter will not work!
        filterSpec.setLang("");
        return filterSpec;
    }

    /**
     * Builds a filter string for a given field path and field value.
     *
     * @param fieldPath  the path of the field to filter on.
     * @param fieldValue the value of the field to filter on.
     * @return a filter string in the format "fieldPath:fieldValue".
     */
    private String buildFilter(String fieldPath, String fieldValue) {
        return SearchUtils.modelToSearchPath(fieldPath) + ":" + fieldValue;
    }

    /**
     * Maps an {@link IDocument} to a {@link Contact} object using the document field values and the given localized
     * text maps.
     *
     * @param contactDoc                     the document representing the contact.
     * @param genderToLocalizedTextMap       the map of gender values to localized text.
     * @param customerTypeToLocalizedTextMap the map of customer type values to localized text.
     * @param phoneTypeToLocalizedTextMap    the map of phone type values to localized text.
     * @return a {@link Contact} object populated with data from the document.
     */
    private Contact mapToContact(IDocument contactDoc,
                                 Map<String, String> genderToLocalizedTextMap,
                                 Map<String, String> customerTypeToLocalizedTextMap,
                                 Map<String, String> phoneTypeToLocalizedTextMap) {
        String firstName = getFieldValueAsString(contactDoc, CONTACT_PERSONALDATA_FIRSTNAME_PATH);
        String lastName = getFieldValueAsString(contactDoc, CONTACT_PERSONALDATA_LASTNAME_PATH);
        String email = getFieldValueAsString(contactDoc, CONTACT_PERSONALDATA_EMAIL_PATH);
        String gender = getFieldValueAsString(contactDoc, CONTACT_PERSONALDATA_GENDER_PATH);
        String nationality = getFieldValueAsString(contactDoc, CONTACT_PERSONALDATA_NATIONALITY_PATH);
        String customerType = getFieldValueAsString(contactDoc, CONTACT_PERSONALDATA_CUSTOMER_TYPE_PATH);
        List<Contact.Phone> phones = mapToContactPhones(contactDoc, phoneTypeToLocalizedTextMap);

        return Contact.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .gender(genderToLocalizedTextMap.get(gender))
                .nationality(nationality)
                .customerType(customerTypeToLocalizedTextMap.get(customerType))
                .phones(phones)
                .build();
    }

    /**
     * Builds a map of field values to localized text for a specific field path.
     *
     * @param searchService  the search service used to look up field values.
     * @param fieldPath      the path of the field to look up.
     * @param localeLanguage the language code used for localization.
     * @return a map of field values to their localized text.
     */
    private Map<String, String> buildFieldValueToLocalizedTextMap(IDocumentModelSearchService searchService,
                                                                  String fieldPath,
                                                                  String localeLanguage) {
        Locale locale = new Locale(localeLanguage);
        return getEnumValuesFromFieldPath(searchService, fieldPath).stream()
                .collect(toMap(IEnumerationType.IEnumValue::getValue, enumVal -> enumVal.getLabel().get(locale)));
    }

    /**
     * Retrieves the enumeration values for a specified field path.
     *
     * @param searchService the search service used to look up field values.
     * @param fieldPath     the path of the field to look up.
     * @return a list of {@link IEnumerationType.IEnumValue} representing the enumeration values for the field.
     * @throws NoSuchElementException if the field element is not found at the specified path.
     */
    private List<IEnumerationType.IEnumValue> getEnumValuesFromFieldPath(IDocumentModelSearchService searchService,
                                                                         String fieldPath) {
        final IField element = (IField) searchService.getByPath(fieldPath)
                .orElseThrow(() -> new NoSuchElementException("Element not found for path: " + fieldPath));
        final IFieldType fieldType = element.getFieldType();

        if (fieldType instanceof ITypeDefType typeDefType) {
            return typeDefType.getTypeDefinition()
                    .map(IFieldTypeDefinition::getFieldType)
                    .filter(IEnumerationType.class::isInstance)
                    .map(IEnumerationType.class::cast)
                    .map(IEnumerationType::getValues)
                    .orElse(emptyList());

        } else if (fieldType instanceof IEnumerationType enumerationType) {
            return enumerationType.getValues();
        }

        return emptyList();
    }

    /**
     * Retrieves the value of a field as a string from a document for a specified field path.
     *
     * @param contactDoc the document containing the field.
     * @param fieldPath  the path of the field to retrieve the value for.
     * @return the value of the field as a string, or an empty string if the field value is not present.
     */
    private String getFieldValueAsString(IDocument contactDoc, String fieldPath) {
        return contactDoc.getEntityInstances().stream()
                .filter(ei -> ei.getPath().equals(fieldPath))
                .findFirst()
                .map(IFieldInstance.class::cast)
                .flatMap(IFieldInstance::getValue)
                .map(String::valueOf)
                .orElse("");
    }

    /**
     * Maps the phone numbers and types from an {@link IDocument} to a list of {@link Contact.Phone} objects.
     *
     * @param contactDoc                  the contact document containing phone information.
     * @param phoneTypeToLocalizedTextMap the map of phone type values to localized text.
     * @return a list of {@link Contact.Phone} objects populated with phone numbers and types from the document.
     */
    private List<Contact.Phone> mapToContactPhones(IDocument contactDoc, Map<String, String> phoneTypeToLocalizedTextMap) {
        Map<String, Contact.Phone> repetitionsToPhones = new HashMap<>();
        contactDoc.getEntityInstances().stream()
                .filter(ei -> ei.getPath().equals(CONTACT_PHONES_PHONE_NUMBER_PATH)
                        || ei.getPath().equals(CONTACT_PHONES_PHONE_TYPE_PATH))
                .forEach(ei -> {
                    // Use repetitions as a key to uniquely identify and map each phone number and its associated type
                    // within the contact document.
                    String repetitionsKey = getRepetitionsKey(ei.getRepetitions());
                    Contact.Phone phone = repetitionsToPhones.computeIfAbsent(repetitionsKey, k -> Contact.Phone.builder().build());
                    String fieldValue = ((IFieldInstance) ei).getValue().map(String::valueOf).orElse("");

                    if (ei.getPath().equals(CONTACT_PHONES_PHONE_NUMBER_PATH)) {
                        phone.setNumber(fieldValue);
                    } else {
                        phone.setType(phoneTypeToLocalizedTextMap.get(fieldValue));
                    }
                });
        return new ArrayList<>(repetitionsToPhones.values());
    }

    /**
     * Generates a string key representation for an array of integers.
     *
     * @param repetitions the array of integers representing repetitions.
     * @return a string representation of the array, useful as a key in maps.
     */
    private String getRepetitionsKey(int[] repetitions) {
        return Arrays.toString(repetitions);
    }
}
