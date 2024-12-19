package com.mgmtp.a12.tutorial.server.addressvalidation;

import com.mgmtp.a12.tutorial.server.utils.Problem;

public class AddressProblem implements Problem {

    private final String message;

    public AddressProblem(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
