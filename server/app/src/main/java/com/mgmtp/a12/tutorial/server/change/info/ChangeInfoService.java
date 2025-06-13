package com.mgmtp.a12.tutorial.server.change.info;

import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import com.mgmtp.a12.tutorial.server.utils.ChangeInfoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChangeInfoService {

    private final ChangeInfoUtils changeInfoUtils;

    /**
     * If the document is instantiated from `Contact_DM`, sets the creation information (<code>createdAt</code> and
     * <code>createdBy</code>) for the given document.
     *
     * @param document the document based on which the creation information should be set.
     * @return the updated document with creation information set.
     */
    public DocumentV2 setCreationInfo(DocumentV2 document) {
        // Put your code here ...
        return null;
    }

    /**
     * If the document is instantiated from `Contact_DM`,
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
        // Put your code here ...
        return null;
    }
}
