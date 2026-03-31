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

export { RESOURCE_KEYS };

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
    return { locale: DATE_LOCALES[locale.language] ?? enUS };
}
