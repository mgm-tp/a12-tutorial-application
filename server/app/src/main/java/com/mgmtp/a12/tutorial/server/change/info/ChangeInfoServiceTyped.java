package com.mgmtp.a12.tutorial.server.change.info;

import com.mgmtp.a12.kernel.md.document.apiV2.UpdateAction;
import com.mgmtp.a12.kernel.md.document.apiV2.documentchanges.Change;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.FieldInstanceV2;
import com.mgmtp.a12.tutorial.server.contact.typings.pointers._contact_dm._contact._historyinfo.PChangeHistory;
import com.mgmtp.a12.tutorial.server.contact.typings.pointers._contact_dm._contact._historyinfo._changehistory.PChangeDetails;
import com.mgmtp.a12.tutorial.server.contact.typings.views.Contact_DM;
import com.mgmtp.a12.tutorial.server.contact.typings.views._contact_dm._contact._historyinfo.ChangeHistory;
import com.mgmtp.a12.tutorial.server.contact.typings.views._contact_dm._contact._historyinfo._changehistory.ChangeDetails;
import com.mgmtp.a12.tutorial.server.contact.typings.views._contact_dm._contact._historyinfo._changehistory._changedetails.ChangeType;
import com.mgmtp.a12.tutorial.server.contact.typings.views._contact_dm._contact._historyinfo._changehistory._changedetails.ChangedProperty;
import com.mgmtp.a12.tutorial.server.utils.ChangeInfoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CHANGE_HISTORY_TYPED_POINTER;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CREATED_AT_TYPED_POINTER;
import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_CREATED_BY_TYPED_POINTER;

/**
 * This is a version of the {@link ChangeInfoService}, which uses the generated pointers and views for type safety.
 */
@Component
@RequiredArgsConstructor
public class ChangeInfoServiceTyped {

    private final ChangeInfoUtils changeInfoUtils;

    /**
     * Like {@link ChangeInfoService#setCreationInfo(DocumentV2)}, but uses the generated accessor classes.
     */
    public DocumentV2 setCreationInfo(DocumentV2 document) {
        if (!CONTACT_MODEL_NAME.equals(document.getDocumentModelId())) {
            return document;
        }

        Instant createdAtInstant = Instant.now();
        String userName = changeInfoUtils.getUserName();
        List<UpdateAction> updates = List.of(
                UpdateAction.putFieldValue(CONTACT_CREATED_AT_TYPED_POINTER._unwrap(), createdAtInstant),
                UpdateAction.putFieldValue(CONTACT_CREATED_BY_TYPED_POINTER._unwrap(), userName)
        );

        return document.withBatchUpdates(updates);
    }

    /**
     * Like {@link ChangeInfoService#updateModificationInfo(DocumentV2, DocumentV2)}, but uses the generated
     * accessor classes.
     */
    public DocumentV2 updateModificationInfo(DocumentV2 updatedDocument, DocumentV2 persistedDocument) {
        if (!CONTACT_MODEL_NAME.equals(updatedDocument.getDocumentModelId())) {
            return updatedDocument;
        }
        Contact_DM updatedTypedDoc = Contact_DM._viewOf(updatedDocument);

        Contact_DM typedDocWithUpToDateEntries = getDocWithEntriesUpToDate(updatedTypedDoc);

        List<Change<FieldInstanceV2>> fieldChanges =
                changeInfoUtils.determineRelevantFieldChanges(typedDocWithUpToDateEntries._unwrap(), persistedDocument);
        if (fieldChanges.isEmpty()) {
            return typedDocWithUpToDateEntries._unwrap();
        }

        Instant modifiedAtInstant = Instant.now();
        String userName = changeInfoUtils.getUserName();

        PChangeHistory<ChangeHistory> changeHistoryPointer = ChangeHistory._pointer();
        PChangeDetails<ChangeDetails> changeDetailsPointer = ChangeDetails._pointer();
        List<ChangeDetails> changeDetails = new ArrayList<>();
        for (Change<FieldInstanceV2> change : fieldChanges) {
            ChangeDetails changeDetail = ChangeDetails._empty()
                    ._with(
                            changeDetailsPointer.changedProperty(),
                            ChangedProperty.valueOf(changeInfoUtils.getEntityName(change.pointer()))
                    )
                    ._with(changeDetailsPointer.changeType(), mapChangeType(change))
                    ._with(changeDetailsPointer.repetition(), changeInfoUtils.getParentRepetition(change.pointer()));
            changeDetails.add(changeDetail);
        }

        ChangeHistory currentChangeEntry = ChangeHistory._empty()
                ._with(changeHistoryPointer.modifiedAt(), modifiedAtInstant)
                ._with(changeHistoryPointer.modifiedBy(), userName)
                ._with(changeHistoryPointer.changeDetails(), changeDetails);
        return typedDocWithUpToDateEntries
                ._withAppendedRepetition(CONTACT_CHANGE_HISTORY_TYPED_POINTER, currentChangeEntry)._unwrap();
    }

    /**
     * Like {@link ChangeInfoService#getDocWithEntriesUpToDate(DocumentV2)}, but uses the generated
     * accessor classes.
     */
    private Contact_DM getDocWithEntriesUpToDate(Contact_DM document) {
        Instant oneYearAgo = ZonedDateTime.now().minusYears(1).toInstant();
        List<ChangeHistory> upToDateEntries = new ArrayList<>();
        boolean withOutdatedEntries = false;
        for (ChangeHistory entry : document.contact().historyInfo().changeHistory()) {
            if (entry.modifiedAt().isAfter(oneYearAgo)) {
                upToDateEntries.add(entry);
            } else {
                withOutdatedEntries = true;
            }
        }
        if (withOutdatedEntries) {
            return document._with(CONTACT_CHANGE_HISTORY_TYPED_POINTER, upToDateEntries);
        } else {
            return document;
        }
    }

    private ChangeType mapChangeType(Change<FieldInstanceV2> change) {
        if (change.isAdd()) {
            return ChangeType.added;
        }
        if (change.isDelete()) {
            return ChangeType.deleted;
        } else {
            return ChangeType.updated;
        }
    }

}
