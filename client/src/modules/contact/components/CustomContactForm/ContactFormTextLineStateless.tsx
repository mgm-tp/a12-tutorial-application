import { type ReactElement, useContext } from "react";

import { DefaultWidgetMap, FormModel } from "@com.mgmtp.a12.formengine/formengine-core";
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";

import BirthdayTextLineStateless from "./BirthdayTextLineStateless";
import { ContactFormControlContext } from "./ContactFormControl";

const AnnotationBirthdayAddon = "contact-dob-field";

export default function ContactFormTextLineStateless(props: TextLineStatelessProps): ReactElement {
    // Get the model element of the current control from custom context
    const modelElement = useContext(ContactFormControlContext)?.modelElement;

    // Check if Model Element is of type Control and has a birthday annotation
    if (
        modelElement &&
        FormModel.Control.isInstance(modelElement) &&
        modelElement.annotations?.some((annot) => annot.name === AnnotationBirthdayAddon)
    ) {
        return <BirthdayTextLineStateless {...props} />;
    }

    return <DefaultWidgetMap.TextLineStateless {...props} />;
}
