import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { HeaderTrigger } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list";
import { PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu";
import { LocaleActions, LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main";

import { LocaleWithName, supportedLocalesWithName } from "../localization";

interface LocaleChooserProps {
    readonly locales?: LocaleWithName[];
}

export default function LocaleChooser({ locales }: LocaleChooserProps): JSX.Element {
    const dispatch = useDispatch();
    const supportedLocales = locales && locales.length > 0 ? locales : supportedLocalesWithName;
    const size = useContext(SizeContext);
    const mobileMode = size.currentSize === "xs" || size.currentSize === "sm";
    const locale = useSelector(LocaleSelectors.locale());

    const onSelectLocale = (selectedLocale: Locale): void => {
        if (locale.language !== selectedLocale.language) {
            setLocale(selectedLocale);
        }
    };

    const setLocale = (locale: Locale): void => {
        dispatch(LocaleActions.set(locale));
    };

    return (
        <PopUpMenu
            triggerElement={
                <HeaderTrigger
                    graphic="public"
                    text={mobileMode ? "" : locale.language.toUpperCase()}
                    meta={mobileMode ? undefined : "arrow_drop_down"}
                    textTitle={locale.country}
                />
            }>
            <List>
                {supportedLocales.map((item) => (
                    <List.Item
                        key={item.language}
                        text={`${item.name} (${item.language.toUpperCase()})`}
                        meta={item.language === locale.language && <Icon>check</Icon>}
                        selected={item.language === locale.language}
                        onClick={() => onSelectLocale(item)}
                    />
                ))}
            </List>
        </PopUpMenu>
    );
}
