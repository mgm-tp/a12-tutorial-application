package com.mgmtp.a12.tutorial.server;

import com.mgmtp.a12.kernel.md.document.api.IDocument;
import com.mgmtp.a12.kernel.md.document.api.IFieldInstance;
import com.mgmtp.a12.kernel.md.document.api.services.DocumentDeserializationConfig;
import com.mgmtp.a12.kernel.md.document.api.services.DocumentSerializationConfig;
import com.mgmtp.a12.kernel.md.document.api.services.IDocumentSerializer;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.facade.DocumentServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSearchService;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSerializer;
import com.mgmtp.a12.tutorial.server.utils.TestDocumentModelResolver;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;

@Slf4j
public class BaseTest {

    protected IDocumentModel documentModel;

    protected IDocumentModelSerializer documentModelSerializer = new DocumentModelServiceFactory().createDocumentModelSerializer();

    protected TestDocumentModelResolver documentModelResolver = TestDocumentModelResolver.getInstance();

    protected DocumentServiceFactory documentServiceFactory = new DocumentServiceFactory(documentModelResolver);

    protected IDocumentSerializer documentSerializer = documentServiceFactory.createDocumentSerializer();

    protected IDocumentModelSearchService documentModelSearchService;

    protected final String basePath = "src/test/resources/data/";

    protected void setUp(String testDocumentModelPath) throws IOException {
        try (StringReader stringReader = new StringReader(readFileAsString(testDocumentModelPath))) {
            log.info("Deserializing Document Model: {}", testDocumentModelPath);

            documentModel = documentModelSerializer.deserialize(stringReader);
        } catch (IOException e) {
            throw e;
        }
        documentModelResolver.addDocumentModel(documentModel);

        documentModelSearchService = new DocumentModelServiceFactory().createDocumentModelSearchService(documentModel);
    }

    private String readFileAsString(String pathToFile) throws IOException {
        try {
            log.info("Reading file: {}", pathToFile);

            return new String(Files.readAllBytes(Paths.get(pathToFile)));
        } catch (IOException e) {
            throw e;
        }
    }

    protected IDocument convertJsonToDocument(String pathToJson) throws IOException {
        try (StringReader stringReader = new StringReader(readFileAsString(pathToJson))) {
            log.info("Deserializing document: {}", pathToJson);

            return documentSerializer.deserialize(stringReader,
                    CONTACT_MODEL_NAME,
                    createJsonReaderConfig(),
                    rankedNotification -> {
                    });
        } catch (IOException e) {
            throw e;
        }
    }

    protected DocumentDeserializationConfig createJsonReaderConfig() {
        return DocumentDeserializationConfig.builder().format(DocumentSerializationConfig.Format.JSON).build();
    }

    protected IFieldInstance getFieldInstanceForPath(IDocument document, String path) {
        return document.getEntityInstances().stream()
                .filter(IFieldInstance.class::isInstance)
                .filter(ei -> ei.getPath().equals(path))
                .map(IFieldInstance.class::cast)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No such field: " + path));
    }

    protected Object getFieldValue(IFieldInstance fieldInstance) {
        return fieldInstance.getValue().orElse("");
    }
}
