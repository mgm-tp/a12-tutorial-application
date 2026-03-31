import { type PropsWithChildren, useMemo, useState } from "react";

import {
    type DefaultThemeType,
    createContext,
    flatTheme,
    useContextSelector
} from "@com.mgmtp.a12.widgets/widgets-core";
import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging";

import { isTheme } from "../utils/guards";

const logger = LoggerFactory.getLogger("PT/ThemeContext");

interface ThemeContextType {
    theme: string;

    setTheme(theme: string): void;
}

export const THEME_KEY = "theme";

function convertFileNameToDisplayName(filePath: string): string {
    return filePath
        .replace(/(?:^\.\/|\.json$)/g, "")
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function loadThemesFromFolder(): { [key: string]: DefaultThemeType } {
    try {
        const context = require.context("../themes", false, /\.json$/);
        const themes: { [key: string]: DefaultThemeType } = {};
        context.keys().forEach((key: string) => {
            const themeName = convertFileNameToDisplayName(key);
            const themeData = context(key);
            if (isTheme(themeData)) {
                themes[themeName] = themeData;
            } else {
                logger.warn(`Theme "${themeName}" does not match the required theme structure and will be skipped.`);
            }
        });
        return themes;
    } catch {
        return {};
    }
}

export const THEMES: {
    Flat: DefaultThemeType;
    [key: string]: DefaultThemeType;
} = {
    Flat: flatTheme,
    ...loadThemesFromFolder()
};

export const THEME_NAMES = Object.keys(THEMES) as ["Flat"] & string[];

function getThemeNameByString(value: string | null | undefined): string {
    return typeof value === "string" && THEME_NAMES.includes(value) ? value : THEME_NAMES[0];
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "Flat",
    setTheme: () => {}
});
ThemeContext.displayName = "ThemeContext";

export const ThemeContextProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState(getThemeNameByString(localStorage.getItem(THEME_KEY)));

    const themeContextValue: ThemeContextType = useMemo(() => {
        return {
            theme,
            setTheme
        };
    }, [theme]);

    return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

export function useThemeContext<T>(selector: (value: ThemeContextType) => T): T {
    return useContextSelector(ThemeContext, selector);
}
