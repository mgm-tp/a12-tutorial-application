import { ReactElement, useContext } from "react";

import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core/lib/models";
import { DefaultWidgetMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main";
import { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { getDateFromString, isBirthdayTodayOrNextWeek } from "../../utils/dateUtils";

import BirthdayTextLineStateless from "./BirthdayTextLineStateless";
import { ContactFormControlContext } from "./ContactFormControl";

export default function ContactFormTextLineStateless(props: TextLineStatelessProps): ReactElement {
    const { locale } = useContext(LocalizerContext);
    const contactFormControlContext = useContext(ContactFormControlContext);
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
            return <BirthdayTextLineStateless {...props} icon="celebration" iconColor="green" />;
        } else if (isBirthdayNextWeek) {
            return <BirthdayTextLineStateless {...props} icon="notification_important" iconColor="yellow" />;
        }
    }

    return <DefaultWidgetMap.TextLineStateless {...props} />;
}
