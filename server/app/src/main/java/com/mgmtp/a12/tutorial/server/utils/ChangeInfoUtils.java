package com.mgmtp.a12.tutorial.server.utils;

import com.mgmtp.a12.dataservices.model.persistence.IModelLoader;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChangeInfoUtils {

    private final IModelLoader<IDocumentModel> documentModelLoader;
    private final DocumentModelServiceFactory docModelServiceFactory;

    public String getUserName() {
        return ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
    }

}
