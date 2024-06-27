import React from "react";

import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core/lib/models";
import { DefaultFormModelMap, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";

export const ContactFormControlContext = React.createContext<
    FormModelMap.FormModelComponentProps<FormModel.Control> | undefined
>(undefined);

export default function ContactFormControlFormModel(
    props: FormModelMap.FormModelComponentProps<FormModel.Control>
): React.ReactElement {
    return (
        <ContactFormControlContext.Provider value={props}>
            <DefaultFormModelMap.Control.component {...props} />
        </ContactFormControlContext.Provider>
    );
}
