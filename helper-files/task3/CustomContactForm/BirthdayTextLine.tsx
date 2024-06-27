import React from "react";

import { DefaultWidgetMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { Icon, TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";

interface BirthdayTextLineProps extends TextLineStatelessProps {
    icon: "notification_important" | "celebration";
    iconColor: "yellow" | "green";
}

export default function BirthdayInput({
    icon,
    iconColor,
    ...textLineStatelessProps
}: BirthdayTextLineProps): React.ReactElement {
    return (
        <DefaultWidgetMap.TextLineStateless
            {...textLineStatelessProps}
            addonAfter={
                <Icon size="big" className={`-u-text-${iconColor}`}>
                    {icon}
                </Icon>
            }
        />
    );
}
