import React from "react";
import { useSelector } from "react-redux";

import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core/lib/models";
import { DefaultFormModelMap, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { GlobalMessageBox } from "@com.mgmtp.a12.widgets/widgets-core";
import { FormEngineSelectors } from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions";

import { RESOURCE_KEYS, useLocalizer } from "../../../../localization";
import { Contact } from "../../../../types/contact";
import { daysUntil, setDateYearToNextOccurrence } from "../../../../utils/dateUtils";

interface ContactFormScreenFormModelProps extends FormModelMap.FormModelComponentProps<FormModel.Screen> {
    activityId: string;
}

export default function ContactFormScreenFormModel({
    activityId,
    ...screenProps
}: ContactFormScreenFormModelProps): React.ReactElement {
    const localizer = useLocalizer();
    const dataState = useSelector(FormEngineSelectors.dataState(activityId));

    // The state holds contact data in the shape of our Contact_DM
    if ("Contact" in dataState.document) {
        const contact = dataState.document.Contact as Contact;
        const dob = contact.PersonalData.DateOfBirth;

        if (dob) {
            const daysUntilBirthday = daysUntil(setDateYearToNextOccurrence(dob));
            return (
                <>
                    <GlobalMessageBox
                        content={
                            daysUntilBirthday
                                ? localizer(RESOURCE_KEYS.contact.form.screen.daysUntilBirthday, {
                                      daysNum: { type: "plain", value: daysUntilBirthday }
                                  })
                                : localizer(RESOURCE_KEYS.contact.form.screen.birthdayToday)
                        }
                    />
                    <DefaultFormModelMap.Screen.component {...screenProps} />
                </>
            );
        }
    }

    return <DefaultFormModelMap.Screen.component {...screenProps} />;
}
