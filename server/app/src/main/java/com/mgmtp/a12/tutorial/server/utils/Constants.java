package com.mgmtp.a12.tutorial.server.utils;

import com.mgmtp.a12.kernel.md.document.apiV2.DocumentPointer;
import com.mgmtp.a12.kernel.md.document.apiV2.typed.TypedPointer;
import com.mgmtp.a12.kernel.md.document.apiV2.typed.TypedRepetitionsPointer;
import com.mgmtp.a12.tutorial.server.typings.pointers._contact_dm.PContact;
import com.mgmtp.a12.tutorial.server.typings.pointers._contact_dm._contact.PHistoryInfo;
import com.mgmtp.a12.tutorial.server.typings.pointers._contact_dm._contact._historyinfo.PChangeHistory;
import com.mgmtp.a12.tutorial.server.typings.views.Contact_DM;
import com.mgmtp.a12.tutorial.server.typings.views._contact_dm._contact._historyinfo.ChangeHistory;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.Instant;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class Constants {

    public static final String CONTACT_MODEL_NAME = "Contact_DM";
    public static final String CONTACT_PERSONALDATA_EMAIL_PATH = "/Contact/PersonalData/Email";
    public static final String CONTACT_PERSONALDATA_FIRSTNAME_PATH = "/Contact/PersonalData/FirstName";
    public static final String CONTACT_PERSONALDATA_LASTNAME_PATH = "/Contact/PersonalData/LastName";
    public static final String CONTACT_PERSONALDATA_GENDER_PATH = "/Contact/PersonalData/Gender";
    public static final String CONTACT_PERSONALDATA_NATIONALITY_PATH = "/Contact/PersonalData/Nationality";
    public static final String CONTACT_PERSONALDATA_CUSTOMER_TYPE_PATH = "/Contact/PersonalData/CustomerType";
    public static final String CONTACT_PHONES_PATH = "/Contact/Phones";
    public static final String CONTACT_PHONES_PHONE_NUMBER_PATH = "/Contact/Phones/PhoneNumber";
    public static final String CONTACT_PHONES_PHONE_TYPE_PATH = "/Contact/Phones/Type";
    public static final String CONTACT_ADDRESS_PATH = "/Contact/Address";

    public static final String CONTACT_CHANGED_PROPERTY_PATH =
            "/Contact/HistoryInfo/ChangeHistory/ChangeDetails/ChangedProperty";

    public static final DocumentPointer CONTACT_POINTER = DocumentPointer.of("Contact");
    public static final DocumentPointer CONTACT_HISTORY_INFO_POINTER = CONTACT_POINTER.withAppended("HistoryInfo", 1);
    public static final DocumentPointer CONTACT_CREATED_AT_POINTER =
            CONTACT_HISTORY_INFO_POINTER.withAppended("CreatedAt", 1);
    public static final DocumentPointer CONTACT_CREATED_BY_POINTER =
            CONTACT_HISTORY_INFO_POINTER.withAppended("CreatedBy", 1);
    public static final DocumentPointer CONTACT_CHANGE_HISTORY_POINTER =
            CONTACT_HISTORY_INFO_POINTER.withAppended("ChangeHistory", 0);

    public static final String CONTACT_MODIFIED_AT_FIELD_NAME = "ModifiedAt";
    public static final String CONTACT_MODIFIED_AT_POINTER_PATTERN =
            "/Contact/HistoryInfo/ChangeHistory[%s]/ModifiedAt";
    public static final String CONTACT_MODIFIED_BY_POINTER_PATTERN =
            "/Contact/HistoryInfo/ChangeHistory[%s]/ModifiedBy";
    public static final String CONTACT_CHANGED_PROPERTY_POINTER_PATTERN =
            "/Contact/HistoryInfo/ChangeHistory[%s]/ChangeDetails[%s]/ChangedProperty";
    public static final String CONTACT_CHANGE_TYPE_POINTER_PATTERN =
            "/Contact/HistoryInfo/ChangeHistory[%s]/ChangeDetails[%s]/ChangeType";
    public static final String CONTACT_CHANGE_REPETITION_POINTER_PATTERN =
            "/Contact/HistoryInfo/ChangeHistory[%s]/ChangeDetails[%s]/Repetition";

    // typed pointer
    public static final PContact<Contact_DM> CONTACT_TYPED_POINTER = Contact_DM._pointer().contact();
    public static final PHistoryInfo<Contact_DM> CONTACT_HISTORY_INFO_TYPED_POINTER =
            CONTACT_TYPED_POINTER.historyInfo();
    public static final TypedPointer<Contact_DM, Instant> CONTACT_CREATED_AT_TYPED_POINTER =
            CONTACT_HISTORY_INFO_TYPED_POINTER.createdAt();
    public static final TypedPointer<Contact_DM, String> CONTACT_CREATED_BY_TYPED_POINTER =
            CONTACT_HISTORY_INFO_TYPED_POINTER.createdBy();
    public static final TypedRepetitionsPointer<Contact_DM, ChangeHistory, PChangeHistory<Contact_DM>>
            CONTACT_CHANGE_HISTORY_TYPED_POINTER = CONTACT_HISTORY_INFO_TYPED_POINTER.changeHistory();

}
