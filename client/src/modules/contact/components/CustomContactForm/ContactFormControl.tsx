import { ReactElement, createContext } from "react";

import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core/lib/models";
import { DefaultFormModelMap, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";

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
