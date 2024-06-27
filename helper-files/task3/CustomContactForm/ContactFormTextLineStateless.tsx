import React from "react";

import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core/lib/models";
import { DefaultWidgetMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main";
import { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { getDateFromString, isBirthdayTodayOrNextWeek } from "../../../../utils/dateUtils";

import BirthdayTextLine from "./BirthdayTextLine";
import { ContactFormControlContext } from "./ContactFormControlFormModel";

export default function ContactFormTextLineStateless(props: TextLineStatelessProps): React.ReactElement {
    const { locale } = React.useContext(LocalizerContext);
    const contactFormControlContext = React.useContext(ContactFormControlContext);
    // Is context available?
    if (!contactFormControlContext) {
        return <DefaultWidgetMap.TextLineStateless {...props} />;
    }

    // Get the annotations array
    const { modelElement } = contactFormControlContext;
    // If our element is a control instance and includes our annotation
    if (
        FormModel.Control.isInstance(modelElement) &&
        modelElement.annotations?.some((annot) => annot.name === "contact-dob-field")
    ) {
        const birthdayDate = getDateFromString(props.value as string, locale.language);
        const { isBirthdayToday, isBirthdayNextWeek } = isBirthdayTodayOrNextWeek(birthdayDate);

        if (isBirthdayToday) {
            return <BirthdayTextLine {...props} icon="celebration" iconColor="green" />;
        } else if (isBirthdayNextWeek) {
            return <BirthdayTextLine {...props} icon="notification_important" iconColor="yellow" />;
        }
    }

    return <DefaultWidgetMap.TextLineStateless {...props} />;
}
