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
        return pointer.getPathParts().getLast().name();
    }

    public BigDecimal getParentRepetition(DocumentPointer pointer) {
        return BigDecimal.valueOf(pointer.parent().repetitionIndexes().getLast());
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
