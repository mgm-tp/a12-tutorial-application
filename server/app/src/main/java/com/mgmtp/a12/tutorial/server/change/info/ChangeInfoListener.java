package com.mgmtp.a12.tutorial.server.change.info;

import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeCreateEvent;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeUpdateEvent;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Class that represents the collection of event listeners for managing the change information of a document.
 * The goal of this class is to listen for events before creating or modifying documents, in order to extend them
 * with the necessary information.
 */
@Component
@RequiredArgsConstructor
public class ChangeInfoListener {

    private final ChangeInfoServiceTyped changeInfoService;

    /**
     * Before the document is created, the creation info will be set from the following listener.
     * The creation info includes creation time and creator.
     */
    @CommonDataServicesEventListener
    public void beforeCreateListener(DocumentBeforeCreateEvent event) {
        DocumentV2 newDocument = changeInfoService.setCreationInfo(event.getCreatedDocument());
        event.setCreatedDocument(newDocument);
    }

    /**
     * Before the document is updated, the history entries will be cleaned up (entries older than 1 year will be
     * removed), and the modification info will be set from the following listener.
     * The modification info includes modification time, modifier and change details.
     */
    @CommonDataServicesEventListener
    public void beforeUpdateListener(DocumentBeforeUpdateEvent event) {
        DocumentV2 newDocument = changeInfoService.updateModificationInfo(
                event.getUpdatedDocument(),
                event.getPersistedDocument());
        event.setUpdatedDocument(newDocument);
    }
}
