package com.mgmtp.a12.tutorial.server.utils;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelResolver;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TestDocumentModelResolver implements IDocumentModelResolver {

    private static TestDocumentModelResolver instance;
    private Map<String, IDocumentModel> documentModels = new HashMap<>();

    public static TestDocumentModelResolver getInstance() {
        if (instance == null) {
            instance = new TestDocumentModelResolver();
        }
        return instance;
    }

    @Override
    public IDocumentModel getDocumentModelById(String id) {
        IDocumentModel documentModel = documentModels.get(id);
        if (documentModel == null) {
            throw new IllegalArgumentException("Document Model with the id '" + id + "' has not been registered yet.");
        }
        return documentModel;
    }

    public void addDocumentModel(IDocumentModel documentModel) {
        documentModels.put(documentModel.getHeader().getId(), documentModel);
    }

}
