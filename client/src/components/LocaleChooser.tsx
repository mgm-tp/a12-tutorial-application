/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (C) 2012-2025 mgm technology partners GmbH
 * All rights reserved. Rights of use are granted under the selected license.
 *
 * Dual License
 * ------------
 * This file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import { useContext } from "react";
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

export default function LocaleChooser({ locales }: LocaleChooserProps): React.ReactNode {
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
