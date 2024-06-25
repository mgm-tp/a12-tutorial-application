package com.mgmtp.a12.tutorial.server.report;

import lombok.Builder;
import lombok.Data;
import lombok.Singular;

import java.util.List;

@Data
@Builder
public class Contact {

    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String nationality;
    private String customerType;
    @Singular
    private List<Phone> phones;

    @Data
    @Builder
    public static class Phone {
        private String number;
        private String type;
    }
}
