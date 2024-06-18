package com.mgmtp.a12.template.server.init;

import com.mgmtp.a12.dataservices.DataServicesApplication;
import com.mgmtp.a12.dataservices.init.app.InitAppApplication;

@DataServicesApplication(scanBasePackages = {
        DataServicesApplication.DATASERVICES_BASE_PACKAGE,
        "com.mgmtp.a12.template.server.init"
})
public class ProjectTemplateInitApplication {
    public static void main(String[] args) {
        InitAppApplication.run(args, ProjectTemplateInitApplication.class);
    }
}
