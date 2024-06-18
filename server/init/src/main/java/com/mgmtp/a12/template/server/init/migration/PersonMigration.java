package com.mgmtp.a12.template.server.init.migration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mgmtp.a12.dataservices.document.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.document.events.DocumentAfterRepositoryLoadEvent;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.migration.MigrationStep;
import com.mgmtp.a12.dataservices.migration.MigrationTask;
import com.mgmtp.a12.dataservices.search.SearchIndexLoader;
import com.mgmtp.a12.uaa.authentication.backend.Authenticated;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@MigrationStep(version = "202306.1.1", name = "Data migration of Person Document")
@Component
public class PersonMigration {

    private static final String MODEL_TO_MIGRATE = "Person_DM";
    private static final String REMOVED_FIELD_PATH = "/Person/PersonalData/PlaceOfBirth";
    private final IDocumentRepository documentRepository;
    private final SearchIndexLoader indexLoader;
    private final MigrationConfiguration config;
    private final ObjectMapper mapper = new ObjectMapper();

    public PersonMigration(final IDocumentRepository documentRepository,
                           final SearchIndexLoader indexLoader,
                           final MigrationConfiguration config) {
        this.documentRepository = documentRepository;
        this.indexLoader = indexLoader;
        this.config = config;
    }

    @Transactional
    @MigrationTask(name = "Remove the PlaceOfBirth field of document")
    @Authenticated(username = "superUser")
    public void migratePlaceOfBirthField() {
        config.setEnabled(true);
        List<DocumentReference> documentReferences = documentRepository.findAllDocRefsForModel(MODEL_TO_MIGRATE);

        documentReferences.forEach(docRef -> {
            Optional<DataServicesDocument> optDocument = documentRepository.findByDocumentReference(docRef);

            optDocument.ifPresent(documentRepository::update);
        });

        config.setEnabled(false);
        indexLoader.rebuildIndexForModel(MODEL_TO_MIGRATE, 500, true);

    }

    @CommonDataServicesEventListener(condition = "@migrationConfiguration.isEnabled() &&"
            + "#afterRepositoryLoadEvent.documentReference.documentModelName.equalsIgnoreCase('Person_DM')")
    public void listenOnDocumentLoadFromRepository(DocumentAfterRepositoryLoadEvent afterRepositoryLoadEvent)
            throws IllegalArgumentException, JsonProcessingException {
        String documentContent = afterRepositoryLoadEvent.getDocumentContent();

        documentContent = migrateDocument(documentContent);

        afterRepositoryLoadEvent.setDocumentContent(documentContent);
    }

    private String migrateDocument(String documentContent)
            throws IllegalArgumentException, JsonProcessingException {
        JsonNode rootJsonNode = mapper.readTree(documentContent);
        ObjectNode rootObjNode = (ObjectNode) rootJsonNode;
        JsonNode parentNode = rootJsonNode.at(REMOVED_FIELD_PATH.substring(0, REMOVED_FIELD_PATH.lastIndexOf("/")));
        String nodeName = REMOVED_FIELD_PATH.substring(REMOVED_FIELD_PATH.lastIndexOf("/") + 1);
        if (parentNode.get(nodeName) != null) {
            ((ObjectNode) parentNode).remove(nodeName);
            return rootObjNode.toString();
        }

        return documentContent;
    }
}
