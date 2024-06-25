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

package com.mgmtp.a12.tutorial.server;

import com.mgmtp.a12.kernel.md.document.api.services.DocumentDeserializationConfig;
import com.mgmtp.a12.kernel.md.document.api.services.DocumentSerializationConfig;
import com.mgmtp.a12.kernel.md.document.apiV2.DocumentPointer;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import com.mgmtp.a12.kernel.md.document.apiV2.services.IDocumentV2Serializer;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.facade.DocumentServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSearchService;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSerializer;
import com.mgmtp.a12.tutorial.server.utils.TestDocumentModelResolver;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.StringReader;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;

import static com.mgmtp.a12.tutorial.server.utils.Constants.CONTACT_MODEL_NAME;

@Slf4j
public class BaseTest {

    protected IDocumentModel documentModel;

    protected IDocumentModelSerializer documentModelSerializer =
            new DocumentModelServiceFactory().createDocumentModelSerializer();

    protected TestDocumentModelResolver documentModelResolver = TestDocumentModelResolver.getInstance();

    protected DocumentServiceFactory documentServiceFactory = new DocumentServiceFactory(documentModelResolver);

    protected IDocumentV2Serializer documentSerializer = documentServiceFactory.createDocumentV2Serializer();

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

    protected DocumentV2 convertJsonToDocument(String pathToJson) {
        try (StringReader stringReader = new StringReader(readFileAsString(pathToJson))) {
            log.info("Deserializing document: {}", pathToJson);

            return documentSerializer.deserializeV2(stringReader,
                    CONTACT_MODEL_NAME,
                    createJsonReaderConfig(),
                    rankedNotification -> {
                    });
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    protected DocumentDeserializationConfig createJsonReaderConfig() {
        return DocumentDeserializationConfig.builder().format(DocumentSerializationConfig.Format.JSON).build();
    }

    protected Object getFieldValue(DocumentV2 document, DocumentPointer pointer) {
        return Optional.ofNullable(document.field(pointer).value()).orElse("");
    }
}
