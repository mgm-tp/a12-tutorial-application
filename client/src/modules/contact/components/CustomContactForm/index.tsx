import { ReactElement, useContext } from "react";

import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import {
    DefaultFormModelMap,
    DefaultWidgetMap,
    FormModelMap,
    WidgetMap
} from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector";
import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions";

import ContactFormControl from "./ContactFormControl";
import ContactFormScreen from "./ContactFormScreen";
import ContactFormTextLineStateless from "./ContactFormTextLineStateless";

export default function CustomContactForm(props: View): ReactElement {
    const { currentSize } = useContext(SizeContext);
    const isSmallScreenSize = currentSize === "xs" || currentSize === "sm";

    return (
        <FormEngineViews.FormEngine
            {...props}
            formModelMap={ContactFormFormModelMap}
            widgetMap={ContactFormWidgetMap}
            cardView={isSmallScreenSize}
        />
    );
}

export const ContactFormFormModelMap: FormModelMap = {
    ...DefaultFormModelMap,
    Control: {
        component(controlProps) {
            return <ContactFormControl {...controlProps} />;
        }
    },
    Screen: {
        component(screenProps) {
            return <ContactFormScreen {...screenProps} />;
        }
    }
};

export const ContactFormWidgetMap: WidgetMap = {
    ...DefaultWidgetMap,
    TextLineStateless(textLineStatelessProps) {
        return <ContactFormTextLineStateless {...textLineStatelessProps} />;
    }
};
