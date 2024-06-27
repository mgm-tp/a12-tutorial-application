import { type ReactElement, createContext } from "react";

import { DefaultFormModelMap, type FormModel, type FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core";

export const ContactFormControlContext = createContext<{ modelElement: FormModel.Control } | undefined>(undefined);

export default function ContactFormControl(
    props: FormModelMap.FormModelComponentProps<FormModel.Control>
): ReactElement {
    return (
        <ContactFormControlContext.Provider value={{ modelElement: props.modelElement }}>
            <DefaultFormModelMap.Control.component {...props} />
        </ContactFormControlContext.Provider>
    );
}
