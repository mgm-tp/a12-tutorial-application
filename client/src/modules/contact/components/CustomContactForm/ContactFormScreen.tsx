import type { ReactElement } from "react";

import { DefaultFormModelMap, type FormModel, type FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core";

import { BirthdayReminderBox } from "./BirthdayReminderBox";

export default function ContactFormScreen(props: FormModelMap.FormModelComponentProps<FormModel.Screen>): ReactElement {
    return (
        <>
            <BirthdayReminderBox />
            <DefaultFormModelMap.Screen.component {...props} />
        </>
    );
}
