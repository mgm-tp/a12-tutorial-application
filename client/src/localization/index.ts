import { useContext } from "react";

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
export type LocaleWithName = Locale & { name?: string };
export const supportedLocalesWithName: LocaleWithName[] = [
    {
        name: "English",
        language: "en",
        country: "US"
    },
    {
        name: "Deutsch",
        language: "de",
        country: "DE"
    }
];

export const supportedLocales: Locale[] = supportedLocalesWithName.map(({ country, language }) => ({
    country,
    language
}));
