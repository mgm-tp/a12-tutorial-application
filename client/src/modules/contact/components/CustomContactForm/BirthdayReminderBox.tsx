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

import { useContext } from "react";
import { useSelector } from "react-redux";

import { GlobalMessageBox } from "@com.mgmtp.a12.widgets/widgets-core";
import { FormEngineSelectors } from "@com.mgmtp.a12.formengine/formengine-core";
import { type Selector, ViewViews } from "@com.mgmtp.a12.client/client-core";

import type { Contact } from "../../types/contact";
import { daysUntil, setDateYearToNextOccurrence } from "../../utils/dateUtils";
import { RESOURCE_KEYS, useLocalizer } from "../../../../localization";

export function BirthdayReminderBox() {
    const activityId = useContext(ViewViews.ActivityContext)?.activityId ?? "No view context with activityId provided";
    const localizer = useLocalizer();
    // Use our custom selector to get the date of birth from current activity
    const dob = useSelector(dateOfBirthSelector(activityId));

    if (!dob) {
        return null;
    }

    const daysUntilBirthday = daysUntil(setDateYearToNextOccurrence(dob));

    return (
        <GlobalMessageBox
            content={
                daysUntilBirthday
                    ? localizer(RESOURCE_KEYS.contact.form.screen.daysUntilBirthday, {
                          daysNum: { type: "plain", value: daysUntilBirthday }
                      })
                    : localizer(RESOURCE_KEYS.contact.form.screen.birthdayToday)
            }
        />
    );
}

function dateOfBirthSelector(activityId: string): Selector<Date | null | undefined> {
    return (state) => {
        // Get the data state from current activity
        const dataState = FormEngineSelectors.dataState(activityId)(state);
        // The state holds contact data in the shape of our Contact_Dc
        const contact = (dataState.document as { Contact?: Contact }).Contact;

        return contact?.PersonalData.DateOfBirth;
    };
}
