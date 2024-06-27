import { ReactElement, useContext, useMemo } from "react";

import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import {
    DefaultFormModelMap,
    DefaultWidgetMap,
    FormModelMap,
    WidgetMap
} from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core";
import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions";

import ContactFormControl from "./ContactFormControl";
import ContactFormScreen from "./ContactFormScreen";
import ContactFormTextLineStateless from "./ContactFormTextLineStateless";

export default function CustomContactForm(props: View): ReactElement {
    const { activityId } = props;
    const { currentSize } = useContext(SizeContext);
    const isSmallScreenSize = currentSize === "xs" || currentSize === "sm";

    const formModelMap: FormModelMap = useMemo(() => createFormModelMap(activityId), [activityId]);
    const widgetMap: WidgetMap = useMemo(() => createWidgetMap(), []);

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
                return <ContactFormControl {...controlProps} />;
            }
        },
        Screen: {
            component(screenProps) {
                return <ContactFormScreen {...screenProps} activityId={activityId} />;
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
