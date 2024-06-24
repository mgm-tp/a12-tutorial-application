package com.mgmtp.a12.tutorial.server.addressvalidation;

import com.byteowls.jopencage.JOpenCageGeocoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AddressConfiguration {

    @Value("${mgmtp.a12.tutorial.server.geocoder.api-key}")
    private String geocoderApiKey;

    @Bean
    public JOpenCageGeocoder getJOpenCageGeocoder() {
        return new JOpenCageGeocoder(geocoderApiKey);
    }
}
