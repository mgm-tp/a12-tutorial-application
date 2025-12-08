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
import { de, enUS, Locale as DateTimeLocale } from "date-fns/locale";

import {
    Locale,
    LocalizableArgs,
    localizableFromLocalizationTreeMap,
    LocalizationTreeMap,
    Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main";

import { en_US } from "./resources/en_US";
import { de_DE } from "./resources/de_DE";

export { RESOURCE_KEYS } from "./keys";

export const DEFAULT_TRANSLATIONS: LocalizationTreeMap = {
    en: en_US,
    de: de_DE
};

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

/**
 * Locale with name of country
 */
export type LocaleWithName = Locale & { name?: string; dateTimeLocale: DateTimeLocale };
export const supportedLocalesWithName: LocaleWithName[] = [
    {
        name: "English",
        language: "en",
        country: "US",
        dateTimeLocale: enUS
    },
    {
        name: "Deutsch",
        language: "de",
        country: "DE",
        dateTimeLocale: de
    }
];

export const supportedLocales: Locale[] = supportedLocalesWithName.map(({ country, language }) => ({
    country,
    language
}));
