package com.mgmtp.a12.tutorial.server.report;

import com.googlecode.jsonrpc4j.JsonRpcParam;
import com.mgmtp.a12.dataservices.rpc.RemoteOperation;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static com.mgmtp.a12.tutorial.server.report.ContactReportOperation.GET_CONTACT_REPORT;

/**
 * This operation is similar to the "LIST_DOCUMENTS" operation, where it collects all the contact data based on the
 * given params.
 */
@Slf4j
@RemoteOperation(name = GET_CONTACT_REPORT)
@Component
@RequiredArgsConstructor
public class ContactReportOperation {

    public static final String GET_CONTACT_REPORT = "GET_CONTACT_REPORT";

    private final ContactReportService contactReportService;

    /**
     * Handles RPC calls to retrieve a list of contacts based on the specified customer type, nationality, and locale language.
     *
     * @param customerType   the type of the customer to filter by (e.g., "Individual", "Business").
     * @param nationality    the nationality of the contacts to filter by (e.g., "German", "British").
     * @param localeLanguage the language code used for localization; must be either "en" or "de".
     * @return a list of {@link Contact} objects matching the specified criteria.
     * @throws IllegalArgumentException if the localeLanguage is not "en" or "de".
     */
    public List<Contact> rpc(@NonNull @JsonRpcParam("customerType") String customerType,
                             @NonNull @JsonRpcParam("nationality") String nationality,
                             @NonNull @JsonRpcParam("localeLanguage") String localeLanguage) {
        log.debug("{} called with parameters [customerType={}, nationality={}, localeLanguage={}]",
                GET_CONTACT_REPORT,
                customerType,
                nationality,
                localeLanguage
        );

        // Put your code here ...
        return new ArrayList<>();
    }
}
