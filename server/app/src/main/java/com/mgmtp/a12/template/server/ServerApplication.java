package com.mgmtp.a12.template.server;

import com.mgmtp.a12.dataservices.DataServicesApplication;
import org.springframework.boot.SpringApplication;

@DataServicesApplication(scanBasePackages = {DataServicesApplication.DATASERVICES_BASE_PACKAGE,
        "com.mgmtp.a12.template.server"})
public class ServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }
}
