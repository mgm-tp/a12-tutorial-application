package com.mgmtp.a12.template.server.migration;

import com.mgmtp.a12.dataservices.document.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.document.events.DocumentAfterRepositoryLoadEvent;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.events.DataServicesEventListener;
import com.mgmtp.a12.dataservices.migration.MigrationStep;
import com.mgmtp.a12.dataservices.migration.MigrationTask;
import com.mgmtp.a12.dataservices.search.SearchIndexLoader;
import com.mgmtp.a12.uaa.authentication.backend.Authenticated;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.List;
import java.util.Optional;


@MigrationStep(version = "202306.1.1", name = "Data migration of Person Document")
public class PersonMigration {

    private static final String MODEL_TO_MIGRATE = "Person-document";
    private static final String REMOVED_FIELD = "PlaceOfBirth";
    private final IDocumentRepository documentRepository;
    private final SearchIndexLoader indexLoader;
    private final MigrationConfiguration config;

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
            Optional<DataServicesDocument> optDocument = documentRepository.getByDocumentReference(docRef);

            optDocument.ifPresent(documentRepository::update);
        });

        config.setEnabled(false);
        indexLoader.rebuildIndexForModel(MODEL_TO_MIGRATE, 500);

    }

    @DataServicesEventListener(condition = "@migrationConfiguration.isEnabled() &&"
            + "#afterRepositoryLoadEvent.documentReference.documentModelName.equalsIgnoreCase('Person-document')")
    public void listenOnDocumentLoadFromRepository(DocumentAfterRepositoryLoadEvent afterRepositoryLoadEvent)
            throws ParserConfigurationException, IOException, SAXException, TransformerException {
        String documentContent = afterRepositoryLoadEvent.getDocumentContent();

        documentContent = migrateDocument(documentContent);

        afterRepositoryLoadEvent.setDocumentContent(documentContent);
    }

    private String migrateDocument(String documentContent)
            throws ParserConfigurationException, IOException, SAXException, TransformerException {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        DocumentBuilder db = dbf.newDocumentBuilder();
        Document document = db.parse(new InputSource(new StringReader(documentContent)));

        if (document.getElementsByTagName(REMOVED_FIELD).getLength() == 1) {
            Node placeOfBirthNode = document.getElementsByTagName(REMOVED_FIELD).item(0);
            placeOfBirthNode.getParentNode().removeChild(placeOfBirthNode);
            return convertXMLDocumentToString(document);
        }

        return documentContent;
    }

    private String convertXMLDocumentToString(Node document) throws TransformerException {
        DOMSource domSource = new DOMSource(document);
        StringWriter writer = new StringWriter();
        StreamResult result = new StreamResult(writer);
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();

        transformer.transform(domSource, result);
        return writer.toString();
    }
}
