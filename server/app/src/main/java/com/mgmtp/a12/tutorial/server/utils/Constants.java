package com.mgmtp.a12.tutorial.server.utils;

import com.mgmtp.a12.kernel.md.document.apiV2.DocumentPointer;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class Constants {

    public static final String CONTACT_MODEL_NAME = "Contact_DM";
    public static final String CONTACT_PERSONALDATA_EMAIL_PATH = "/Contact/PersonalData/Email";
    public static final String CONTACT_PERSONALDATA_LASTNAME_PATH = "/Contact/PersonalData/LastName";
    public static final String CONTACT_PHONES_PATH = "/Contact/Phones";
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

}
