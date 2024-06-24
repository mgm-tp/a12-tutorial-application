package com.mgmtp.a12.tutorial.server.addressvalidation;

import com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeCreateEvent;
import com.mgmtp.a12.dataservices.document.events.DocumentBeforeUpdateEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Class that represents the collection of event listeners utilizing mocked address validators or 3rd party address validators.
 * The goal of this class is to listen for event before creating or modifying documents of model type ContactModel.
 * In case of invalid document, e.g. missing field, custom exception will be thrown.
 * <p>
 * Used Document's events:
 * - DocumentBeforeCreateEvent
 * - DocumentBeforeUpdateEvent
 * <p>
 * For more information about published events by Data Services have a look at the
 * <a href="https://docs.geta12.com/docs/?release=2024.06#content:asciidoc,product:data_services,artifact:dataservices-documentation-src,scene:UaEfdp,anchor:_data_services_events">getA12 documentation</a>.
 */
@Component
@ConditionalOnProperty(prefix = "mgmtp.a12.tutorial.server", value = "addressValidation", havingValue = "true")
@RequiredArgsConstructor
public class AddressValidationListener {

    private final AddressValidator addressValidator;

    /**
     * Before the document is created the address validation will be executed from the following listener
     */
    @CommonDataServicesEventListener
    public void beforeCreateListener(DocumentBeforeCreateEvent event) {
        addressValidator.validateAddress(event.getCreatedDocument());
    }

    /**
     * Before the document is updated the address validation will be executed from the following listener
     */
    @CommonDataServicesEventListener
    public void beforeUpdateListener(DocumentBeforeUpdateEvent event) {
        addressValidator.validateAddress(event.getUpdatedDocument());
    }

}
