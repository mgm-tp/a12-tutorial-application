package com.mgmtp.a12.tutorial.server;

import org.springframework.boot.SpringApplication;

import com.mgmtp.a12.dataservices.DataServicesApplication;

@DataServicesApplication(scanBasePackages = {DataServicesApplication.DATASERVICES_BASE_PACKAGE,
        "com.mgmtp.a12.tutorial.server"})
public class TutorialServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TutorialServerApplication.class, args);
    }
}
