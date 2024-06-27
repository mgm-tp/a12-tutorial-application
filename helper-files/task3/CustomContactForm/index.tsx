import React from "react";

import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import {
    DefaultFormModelMap,
    DefaultWidgetMap,
    FormModelMap,
    WidgetMap
} from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core";
import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions";

import ContactFormControlFormModel from "./ContactFormControlFormModel";
import ContactFormScreenFormModel from "./ContactFormScreenFormModel";
import ContactFormTextLineStateless from "./ContactFormTextLineStateless";

export default function CustomContactForm(props: View): React.ReactElement {
    const { activityId } = props;
    const { currentSize } = React.useContext(SizeContext);
    const isSmallScreenSize = currentSize === "xs" || currentSize === "sm";

    const formModelMap: FormModelMap = React.useMemo(() => createFormModelMap(activityId), [activityId]);
    const widgetMap: WidgetMap = React.useMemo(() => createWidgetMap(), []);

    return (
        <FormEngineViews.FormEngine
            {...props}
            formModelMap={formModelMap}
            widgetMap={widgetMap}
            cardView={isSmallScreenSize}
        />
    );
}

function createFormModelMap(activityId: string): FormModelMap {
    return {
        ...DefaultFormModelMap,
        Control: {
            component(controlProps) {
                return <ContactFormControlFormModel {...controlProps} />;
            }
        },
        Screen: {
            component(screenProps) {
                return <ContactFormScreenFormModel {...screenProps} activityId={activityId} />;
            }
        }
    };
}

function createWidgetMap(): WidgetMap {
    return {
        ...DefaultWidgetMap,
        TextLineStateless(textLineStatelessProps) {
            return <ContactFormTextLineStateless {...textLineStatelessProps} />;
        }
    };
}
