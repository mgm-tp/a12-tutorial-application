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

package com.mgmtp.a12.tutorial.server.change.info;

import com.mgmtp.a12.kernel.md.document.apiV2.DocumentPointer;
import com.mgmtp.a12.kernel.md.document.apiV2.UpdateAction;
import com.mgmtp.a12.kernel.md.document.apiV2.documentchanges.Change;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import com.mgmtp.a12.tutorial.server.utils.ChangeInfoUtils;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.FieldInstanceV2;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.GroupInstanceV2;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.RepetitionsV2;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CREATED_AT_POINTER;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CREATED_BY_POINTER;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CHANGE_HISTORY_POINTER;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODIFIED_AT_FIELD_NAME;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODIFIED_AT_POINTER_PATTERN;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODIFIED_BY_POINTER_PATTERN;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CHANGED_PROPERTY_POINTER_PATTERN;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CHANGE_TYPE_POINTER_PATTERN;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CHANGE_REPETITION_POINTER_PATTERN;

@Component
@RequiredArgsConstructor
public class ChangeInfoService {

    private final ChangeInfoUtils changeInfoUtils;

    /**
     * If the document is instantiated from `Contact_Dc`, sets the creation information (<code>createdAt</code> and
     * <code>createdBy</code>) for the given document.
     *
     * @param document the document based on which the creation information should be set.
     * @return the updated document with creation information set.
     */
    public DocumentV2 setCreationInfo(DocumentV2 document) {
        if (!CONTACT_MODEL_NAME.equals(document.getDocumentModelId())) {
            return document;
        }

        Instant createdAtInstant = Instant.now();
        String userName = changeInfoUtils.getUserName();
        List<UpdateAction> updates = List.of(
                UpdateAction.putFieldValue(CONTACT_CREATED_AT_POINTER, createdAtInstant),
                UpdateAction.putFieldValue(CONTACT_CREATED_BY_POINTER, userName)
        );

        return document.withBatchUpdates(updates);
    }

    /**
     * If the document is instantiated from `Contact_Dc`,
     * <ul>
     *     <li>removes the history entries older than 1 year,</li>
     *     <li>updates the modification information, if there are relevant changes.</li>
     * </ul>
     *
     * @param updatedDocument   the document which potentially contains changes.
     * @param persistedDocument the document which comes from the database (this is the reference document).
     * @return the updated document with the modification information set (if applicable).
     */
    public DocumentV2 updateModificationInfo(DocumentV2 updatedDocument, DocumentV2 persistedDocument) {
        if (!CONTACT_MODEL_NAME.equals(updatedDocument.getDocumentModelId())) {
            return updatedDocument;
        }

        DocumentV2 docWithUpToDateEntries = getDocWithEntriesUpToDate(updatedDocument);

        List<Change<FieldInstanceV2>> relevantFieldChanges =
                changeInfoUtils.determineRelevantFieldChanges(docWithUpToDateEntries, persistedDocument);
        if (relevantFieldChanges.isEmpty()) {
            return docWithUpToDateEntries;
        }

        Instant modifiedAtInstant = Instant.now();
        String userName = changeInfoUtils.getUserName();
        RepetitionsV2 repetitions = docWithUpToDateEntries.groupAllRepetitions(CONTACT_CHANGE_HISTORY_POINTER);
        int nextAvailableRepetitionIndex = repetitions.size() + 1;

        List<UpdateAction> updates = new ArrayList<>();
        updates.add(UpdateAction.putFieldValue(
                CONTACT_MODIFIED_AT_POINTER_PATTERN.formatted(nextAvailableRepetitionIndex), modifiedAtInstant));
        updates.add(UpdateAction.putFieldValue(
                CONTACT_MODIFIED_BY_POINTER_PATTERN.formatted(nextAvailableRepetitionIndex), userName));
        for (int i = 0; i < relevantFieldChanges.size(); i++) {
            Change<FieldInstanceV2> change = relevantFieldChanges.get(i);
            DocumentPointer pointer = change.pointer();
            updates.add(UpdateAction.putFieldValue(
                    CONTACT_CHANGED_PROPERTY_POINTER_PATTERN.formatted(nextAvailableRepetitionIndex, i + 1),
                    changeInfoUtils.getEntityName(pointer)));
            updates.add(UpdateAction.putFieldValue(
                    CONTACT_CHANGE_TYPE_POINTER_PATTERN.formatted(nextAvailableRepetitionIndex, i + 1),
                    mapChangeType(change)));
            updates.add(UpdateAction.putFieldValue(
                    CONTACT_CHANGE_REPETITION_POINTER_PATTERN.formatted(nextAvailableRepetitionIndex, i + 1),
                    changeInfoUtils.getParentRepetition(pointer)));
        }

        return docWithUpToDateEntries.withBatchUpdates(updates);
    }

    /**
     * Removes all entries from the contact change history that are older than 1 year.
     */
    private DocumentV2 getDocWithEntriesUpToDate(DocumentV2 document) {
        Instant oneYearAgo = ZonedDateTime.now().minusYears(1).toInstant();
        List<GroupInstanceV2> upToDateEntries = new ArrayList<>();
        boolean withOutdatedEntries = false;
        for (GroupInstanceV2 entry : document.groupAllRepetitions(CONTACT_CHANGE_HISTORY_POINTER)) {
            boolean youngerThanOneYear = Optional.ofNullable(entry.directField(CONTACT_MODIFIED_AT_FIELD_NAME))
                    .map(FieldInstanceV2::value)
                    .map(Instant.class::cast)
                    .map(instant -> instant.isAfter(oneYearAgo))
                    .orElse(false);
            if (youngerThanOneYear) {
                upToDateEntries.add(entry);
            } else {
                withOutdatedEntries = true;
            }
        }
        if (withOutdatedEntries) {
            return document.withGroupAllRepetitions(CONTACT_CHANGE_HISTORY_POINTER, RepetitionsV2.of(upToDateEntries));
        } else {
            return document;
        }
    }

    // the returned values should correspond to the enumeration values of the field `ChangeType`
    private String mapChangeType(Change<FieldInstanceV2> change) {
        if (change.isAdd()) {
            return "added";
        }
        if (change.isDelete()) {
            return "deleted";
        } else {
            return "updated";
        }
    }

}
