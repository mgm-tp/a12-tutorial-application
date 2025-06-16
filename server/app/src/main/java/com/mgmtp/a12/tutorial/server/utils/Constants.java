/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

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
