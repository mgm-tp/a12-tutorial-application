/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
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
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import { useContext } from "react";
import { de, enUS, type Locale as DateLocale } from "date-fns/locale";

import {
    Locale,
    type LocalizableArgs,
    localizableFromLocalizationTreeMap,
    type LocalizationTreeMap,
    type Localizer
} from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { DateTimeContextType } from "@com.mgmtp.a12.widgets/widgets-core";
import type { LocalizedLocale } from "@com.mgmtp.a12.client/client-core/localization";

import { en_US } from "./resources/en_US";
import { de_DE } from "./resources/de_DE";
import { RESOURCE_KEYS } from "./keys";

export { RESOURCE_KEYS } from "./keys";

export const DEFAULT_TRANSLATIONS: LocalizationTreeMap = {
    en: en_US,
    de: de_DE
} as const;

/**
 * Apply default translations to the Localizer and return new Localizer function,
 * which expects only localization key instead of the whole localizable object.
 */
export const applyDefaultTranslations = (localizer: Localizer) => {
    return (key: string, args?: LocalizableArgs) =>
        localizer(localizableFromLocalizationTreeMap(key, DEFAULT_TRANSLATIONS, args)) ?? "";
};

/**
 * Localizer hook, which returns Localizer with applied default translations.
 */
export const useLocalizer = () => {
    const { localizer } = useContext(LocalizerContext);

    return applyDefaultTranslations(localizer);
};

export const supportedLocales: LocalizedLocale[] = [
    { language: "en", country: "US", name: { key: RESOURCE_KEYS.locale.en } },
    { language: "de", country: "DE", name: { key: RESOURCE_KEYS.locale.de } }
];

const DATE_LOCALES: Record<string, DateLocale> = { en: enUS, de: de };

export function getDateTimeResource(locale: Locale): DateTimeContextType {
    return { locale: DATE_LOCALES[locale.language] ?? enUS, timeMode: "24h" };
}
