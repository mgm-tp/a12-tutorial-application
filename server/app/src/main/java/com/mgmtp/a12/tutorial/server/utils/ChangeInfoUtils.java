package com.mgmtp.a12.tutorial.server.utils;

import com.mgmtp.a12.dataservices.model.persistence.IModelLoader;
import com.mgmtp.a12.kernel.md.document.apiV2.DocumentPointer;
import com.mgmtp.a12.kernel.md.document.apiV2.documentchanges.Change;
import com.mgmtp.a12.kernel.md.document.apiV2.documentchanges.DocumentChanges;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.FieldInstanceV2;
import com.mgmtp.a12.kernel.md.document.apiV2.utils.DocumentV2Utils;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CHANGED_PROPERTY_PATH;

@Component
@RequiredArgsConstructor
public class ChangeInfoUtils {

    private final IModelLoader<IDocumentModel> documentModelLoader;
    private final DocumentModelServiceFactory docModelServiceFactory;

    public String getUserName() {
        return ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
    }

    public String getEntityName(DocumentPointer pointer) {
        return pointer.getPartAtLevel(pointer.size() - 1).name();
    }

    public BigDecimal getParentRepetition(DocumentPointer pointer) {
        return BigDecimal.valueOf(pointer.getPartAtLevel(pointer.size() - 2).repetitionIndex());
    }

    /**
     * Determines the relevant field changes between the given document and its reference.
     * Relevant field changes are those that correspond to the enumeration values of the field
     * <code>ChangedProperty</code> in the contact model.
     *
     * @param document  the document containing the changes.
     * @param reference the reference document to compare against.
     * @return a list of relevant field changes.
     */
    public List<Change<FieldInstanceV2>> determineRelevantFieldChanges(DocumentV2 document, DocumentV2 reference) {
        DocumentV2Utils.CompareConfig config = DocumentV2Utils.CompareConfig.builder().build();
        DocumentChanges documentChanges = DocumentV2Utils.compare(reference, document, config);
        if (documentChanges.noChanges()) {
            return List.of();
        }

        Set<String> relevantFieldNames = getRelevantFieldNames(document);
        List<Change<FieldInstanceV2>> relevantFieldChanges = new ArrayList<>();
        for (Change<FieldInstanceV2> change : documentChanges.expandedFieldChanges()) {
            DocumentPointer pointer = change.pointer();
            if (!relevantFieldNames.contains(getEntityName(pointer))) {
                continue;
            }
            relevantFieldChanges.add(change);
        }
        return relevantFieldChanges;
    }

    /**
     * The enumeration values of the field <code>ChangedProperty</code> correspond to the field names that are relevant
     * for the change history of a contact.
     *
     * @return the set of field names that are relevant for the change history.
     */
    public Set<String> getRelevantFieldNames(DocumentV2 document) {
        IDocumentModel docModel = documentModelLoader.loadModel(document.getDocumentModelId());
        IDocumentModelSearchService docModelSearchService =
                docModelServiceFactory.createDocumentModelSearchService(docModel);
        return docModelSearchService.getByPath(CONTACT_CHANGED_PROPERTY_PATH)
                .map(IField.class::cast)
                .map(IField::getFieldType)
                .map(IEnumerationType.class::cast)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Field '%s' does not exist in the Document Model."
                                        .formatted(CONTACT_CHANGED_PROPERTY_PATH))
                )
                .getValues().stream()
                .map(IEnumerationType.IEnumValue::getValue)
                .collect(Collectors.toSet());
    }

}
