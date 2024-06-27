import { useContext } from "react";
import { DefaultRootState, useSelector } from "react-redux";

import { GlobalMessageBox } from "@com.mgmtp.a12.widgets/widgets-core/lib/global-message-box";
import { FormEngineSelectors } from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions";
import { ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view";

import { Contact } from "../../types/contact";
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

function dateOfBirthSelector(activityId: string) {
    return (state: DefaultRootState) => {
        // Get the data state from current activity
        const dataState = FormEngineSelectors.dataState(activityId)(state);
        // The state holds contact data in the shape of our Contact_DM
        const contact = (dataState.document as { Contact?: Contact }).Contact;

        return contact?.PersonalData.DateOfBirth;
    };
}
