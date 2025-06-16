package com.mgmtp.a12.tutorial.server.report;

import com.mgmtp.a12.dataservices.document.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.model.persistence.IModelLoader;
import com.mgmtp.a12.dataservices.query.DocumentTreeResult;
import com.mgmtp.a12.dataservices.query.Paging;
import com.mgmtp.a12.dataservices.query.QueryService;
import com.mgmtp.a12.dataservices.query.constraint.logical.AndOperator;
import com.mgmtp.a12.dataservices.query.constraint.matching.ExactMatchOperator;
import com.mgmtp.a12.dataservices.query.topology.QueryRoot;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IFieldTypeDefinition;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ITypeDefType;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSearchService;
import com.mgmtp.a12.tutorial.server.typings.views.Contact_DM;
import com.mgmtp.a12.tutorial.server.typings.views._contact_dm._contact.PersonalData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.NoSuchElementException;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_CUSTOMER_TYPE_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_GENDER_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PERSONALDATA_NATIONALITY_PATH;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_PHONES_PHONE_TYPE_PATH;
import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toMap;

@Component
@RequiredArgsConstructor
public class ContactReportService {

    private final QueryService queryService;
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
        QueryRoot queryRoot = QueryRoot.builder()
                .targetDocumentModel(CONTACT_MODEL_NAME)
                .projectionName("document")
                .constraint(createAndOperator(customerType, nationality))
                .paging(new Paging(0, 10))
                .build();
        List<DocumentReference> documentReferences = queryService.query(queryRoot, null).getContent().stream()
                .map(DocumentTreeResult.class::cast)
                .map(DocumentTreeResult::getDocRef)
                .toList();
        List<DataServicesDocument> contactDocuments = documentRepository.findDocumentsByDocRefs(documentReferences);

        IDocumentModel documentModel = documentModelLoader.loadModel(CONTACT_MODEL_NAME);
        final IDocumentModelSearchService searchService =
                documentModelServiceFactory.createDocumentModelSearchService(documentModel);
        Map<String, String> genderToLocalizedTextMap =
                buildEnumValueToLocalizedTextMap(searchService, CONTACT_PERSONALDATA_GENDER_PATH, localeLanguage);
        Map<String, String> customerTypeToLocalizedTextMap =
                buildEnumValueToLocalizedTextMap(searchService, CONTACT_PERSONALDATA_CUSTOMER_TYPE_PATH,
                        localeLanguage);
        Map<String, String> phoneTypeToLocalizedTextMap =
                buildEnumValueToLocalizedTextMap(searchService, CONTACT_PHONES_PHONE_TYPE_PATH, localeLanguage);

        return contactDocuments.stream()
                .map(DataServicesDocument::getKernelDocument)
                .map(Contact_DM::_viewOf)
                .map(document -> mapToContact(
                        document,
                        genderToLocalizedTextMap,
                        customerTypeToLocalizedTextMap,
                        phoneTypeToLocalizedTextMap
                ))
                .toList();
    }

    /**
     * Creates an and-operator for querying contacts based on customer type and nationality.
     *
     * @param customerType the type of the customer to match.
     * @param nationality  the nationality of the contacts to match.
     * @return a {@link AndOperator} object configured with the specified information.
     */
    private AndOperator createAndOperator(String customerType, String nationality) {
        return AndOperator.builder()
                .operands(Set.of(
                        createExactMatchOperator(CONTACT_PERSONALDATA_CUSTOMER_TYPE_PATH, customerType),
                        createExactMatchOperator(CONTACT_PERSONALDATA_NATIONALITY_PATH, nationality)
                ))
                .build();
    }

    /**
     * Creates an exact_match-operator for a given field path and field value.
     *
     * @param fieldPath  the path of the field to match.
     * @param fieldValue the value of the field to match.
     * @return the operator with the given parameters.
     */
    private ExactMatchOperator<Object> createExactMatchOperator(String fieldPath, String fieldValue) {
        return ExactMatchOperator.builder()
                .field(fieldPath)
                .value(fieldValue)
                .build();
    }

    /**
     * Maps an {@link Contact_DM} to a {@link Contact} object using the document field values and the given localized
     * text maps.
     *
     * @param contactDoc                     the document representing the contact.
     * @param genderToLocalizedTextMap       the map of gender values to localized text.
     * @param customerTypeToLocalizedTextMap the map of customer type values to localized text.
     * @param phoneTypeToLocalizedTextMap    the map of phone type values to localized text.
     * @return a {@link Contact} object populated with data from the document.
     */
    private Contact mapToContact(
            Contact_DM contactDoc,
            Map<String, String> genderToLocalizedTextMap,
            Map<String, String> customerTypeToLocalizedTextMap,
            Map<String, String> phoneTypeToLocalizedTextMap
    ) {
        PersonalData personalData = contactDoc.contact().personalData();
        String firstName = getFieldValueAsString(personalData.firstName());
        String lastName = getFieldValueAsString(personalData.lastName());
        String email = getFieldValueAsString(personalData.emailAddress());
        String gender = getFieldValueAsString(personalData.gender());
        String nationality = getFieldValueAsString(personalData.nationality());
        String customerType = getFieldValueAsString(personalData.customerType());
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
    private Map<String, String> buildEnumValueToLocalizedTextMap(
            IDocumentModelSearchService searchService,
            String fieldPath,
            String localeLanguage
    ) {
        Locale locale = Locale.of(localeLanguage);
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
    private List<IEnumerationType.IEnumValue> getEnumValuesFromFieldPath(
            IDocumentModelSearchService searchService,
            String fieldPath
    ) {
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
     * If the value is null, returns an empty string; otherwise, returns the value as a string.
     */
    private String getFieldValueAsString(String value) {
        return Optional.ofNullable(value)
                .orElse("");
    }

    /**
     * If the value is null, returns an empty string; otherwise, returns the enum name as a string.
     */
    private String getFieldValueAsString(Enum<?> value) {
        return Optional.ofNullable(value)
                .map(Enum::name)
                .orElse("");
    }

    /**
     * Maps the phone numbers and types from an {@link Contact_DM} to a list of {@link Contact.Phone} objects.
     *
     * @param contactDoc the contact document containing phone information.
     * @param phoneTypeToLocalizedTextMap the mapping of phone types to their localized text.
     * @return a list of {@link Contact.Phone} objects populated with phone numbers and types from the document.
     */
    private List<Contact.Phone> mapToContactPhones(
            Contact_DM contactDoc,
            Map<String, String> phoneTypeToLocalizedTextMap
    ) {
        return contactDoc.contact().phones().stream()
                .map(phone -> Contact.Phone.builder()
                        .number(getFieldValueAsString(phone.phoneNumber()))
                        .type(phoneTypeToLocalizedTextMap.get(getFieldValueAsString(phone.type())))
                        .build()
                )
                .toList();
    }

}
