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

package com.mgmtp.a12.template.server.init.migration;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;
import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.document.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.document.DocumentService;
import com.mgmtp.a12.dataservices.document.events.DocumentAfterRepositoryLoadEvent;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.migration.MigrationStep;
import com.mgmtp.a12.dataservices.migration.MigrationTask;
import com.mgmtp.a12.uaa.authentication.backend.Authenticated;
import tools.jackson.core.JacksonException;

@MigrationStep(version = "38.3.4", name = "Data migration of Person Document")
@Component
public class PersonMigration {

    private static final String MODEL_TO_MIGRATE = "Person_Dc";
    private static final String REMOVED_FIELD_PATH = "/Person/PersonalData/PlaceOfBirth";
    private final IDocumentRepository documentRepository;
    private final DocumentService documentService;
    private final MigrationConfiguration config;
    private final ObjectMapper mapper = new ObjectMapper();

    public PersonMigration(final IDocumentRepository documentRepository,
                           final DocumentService documentService,
                           final MigrationConfiguration config) {
        this.documentRepository = documentRepository;
        this.documentService = documentService;
        this.config = config;
    }

    @Transactional("dsTransactionManager")
    @MigrationTask(name = "Remove the PlaceOfBirth field of document")
    @Authenticated(username = "superUser")
    public void migratePlaceOfBirthField() {
        config.setEnabled(true);
        List<DocumentReference> documentReferences = documentRepository.findAllDocRefsForModel(MODEL_TO_MIGRATE);

        documentReferences.forEach(docRef -> {
            Optional<DataServicesDocument> optDocument = documentRepository.findByDocumentReference(docRef);

            optDocument.ifPresent(dsDoc -> documentService.update(docRef, dsDoc.getKernelDocument(), Locale.ENGLISH));
        });

        config.setEnabled(false);
    }

    @CommonDataServicesEventListener(condition = "@migrationConfiguration.isEnabled() &&"
            + "#afterRepositoryLoadEvent.documentReference.documentModelName.equalsIgnoreCase('Person_Dc')")
    public void listenOnDocumentLoadFromRepository(DocumentAfterRepositoryLoadEvent afterRepositoryLoadEvent)
            throws IllegalArgumentException, JacksonException {
        String documentContent = afterRepositoryLoadEvent.getDocumentContent();

        documentContent = migrateDocument(documentContent);

        afterRepositoryLoadEvent.setDocumentContent(documentContent);
    }

    private String migrateDocument(String documentContent)
            throws IllegalArgumentException, JacksonException {
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
