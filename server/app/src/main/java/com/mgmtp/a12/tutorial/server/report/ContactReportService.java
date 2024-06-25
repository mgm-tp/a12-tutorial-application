package com.mgmtp.a12.tutorial.server.report;

import com.mgmtp.a12.dataservices.document.DocumentQueryService;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.model.persistence.IModelLoader;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

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
     */
    public List<Contact> getContacts(String customerType, String nationality, String localeLanguage) {
        // Put your code here ...
        return new ArrayList<>();
    }

}