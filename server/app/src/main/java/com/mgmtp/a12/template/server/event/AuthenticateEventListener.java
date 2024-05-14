package com.mgmtp.a12.template.server.event;

import com.mgmtp.a12.dataservices.document.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.document.DocumentService;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeUpdateEvent;
import com.mgmtp.a12.dataservices.events.DataServicesEventListener;
import com.mgmtp.a12.dataservices.exception.NotFoundException;
import com.mgmtp.a12.uaa.authorization.UAADelegatedUserDetail;
import com.mgmtp.a12.uaa.authorization.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Component
public class AuthenticateEventListener {

    @Autowired
    private DocumentService documentService;

    @DataServicesEventListener
    public void beforeUpdateDocument(final DocumentBeforeUpdateEvent event) {
        final DocumentReference documentReference = event.getDocumentReference();
        final UAADelegatedUserDetail user = (UAADelegatedUserDetail) UserUtil.resolveCurrentUser();

        validateUserPermissions(user, documentReference);
    }

    private void validateUserPermissions(final UAADelegatedUserDetail user, final DocumentReference documentReference) {
        final String createdByUser = documentService.load(documentReference)
                .map(DataServicesDocument::getCreatedBy)
                .orElseThrow(() -> new NotFoundException(
                        String.format("The created user in Document [%s] not found", documentReference)));

        final boolean isSuperUser = user.getUsername().equalsIgnoreCase("superUser");
        final boolean isAdminUser =
                user.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equalsIgnoreCase("admin"));

        if (!isAllowedToUpdateDocument(user.getUsername(), createdByUser, isSuperUser, isAdminUser)) {
            throw new AccessDeniedException(String.format("Document Update on Document with documentReference [%s] is denied.", documentReference));
        }
    }

    private boolean isAllowedToUpdateDocument(final String currentUser, final String createdByUser,
                                              final boolean isSuperUser, final boolean isAdminUser) {
        return currentUser.equalsIgnoreCase(createdByUser) || isSuperUser || isAdminUser;
    }
}
