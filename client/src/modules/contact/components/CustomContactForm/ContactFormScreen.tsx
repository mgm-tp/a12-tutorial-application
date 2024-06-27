import { ReactElement } from "react";

import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core/lib/models";
import { DefaultFormModelMap, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";

import { BirthdayReminderBox } from "./BirthdayReminderBox";

export default function ContactFormScreen(props: FormModelMap.FormModelComponentProps<FormModel.Screen>): ReactElement {
    return (
        <>
            <BirthdayReminderBox />
            <DefaultFormModelMap.Screen.component {...props} />
        </>
    );
}
