package com.mgmtp.a12.tutorial.server.addressvalidation;

public class InvalidAddressException extends RuntimeException {

    public InvalidAddressException(String message) {
        super(message);
    }
}
