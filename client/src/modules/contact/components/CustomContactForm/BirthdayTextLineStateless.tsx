import { ReactElement, useContext } from "react";

import { DefaultWidgetMap } from "@com.mgmtp.a12.formengine/formengine-core/lib/view";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon";
import { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main";

import { getDateFromString, isBirthdayTodayOrNextWeek } from "../../utils/dateUtils";

export default function BirthdayTextLineStateless(props: TextLineStatelessProps): ReactElement {
    const birthday = useBirthdayDate(props.value);

    return <DefaultWidgetMap.TextLineStateless {...props} addonAfter={<BirthdayAddon birthday={birthday} />} />;
}

function BirthdayAddon({ birthday }: { birthday?: Date }) {
    if (birthday) {
        const { isBirthdayToday, isBirthdayNextWeek } = isBirthdayTodayOrNextWeek(birthday);

        if (isBirthdayToday || isBirthdayNextWeek) {
            return (
                <Icon size="big" className={`-u-text-${isBirthdayToday ? "green" : "yellow"}`}>
                    {isBirthdayToday ? "celebration" : "notification_important"}
                </Icon>
            );
        }
    }
    return null;
}

function useBirthdayDate(birthday: string | undefined): Date | undefined {
    const language = useContext(LocalizerContext).locale.language;
    return birthday ? getDateFromString(birthday, language) : undefined;
}
