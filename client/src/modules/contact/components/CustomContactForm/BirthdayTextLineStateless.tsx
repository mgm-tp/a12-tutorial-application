import { ReactElement } from "react";

import { DefaultWidgetMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { Icon, TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";

interface BirthdayTextLineStatelessProps extends TextLineStatelessProps {
    icon: "notification_important" | "celebration";
    iconColor: "yellow" | "green";
}

export default function BirthdayTextLineStateless({
    icon,
    iconColor,
    ...props
}: BirthdayTextLineStatelessProps): ReactElement {
    return (
        <DefaultWidgetMap.TextLineStateless
            {...props}
            addonAfter={
                <Icon size="big" className={`-u-text-${iconColor}`}>
                    {icon}
                </Icon>
            }
        />
    );
}
