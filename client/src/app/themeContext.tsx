import * as React from "react";

import { type DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/index.js";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme.js";
import { type Container } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/index.js";
import { createContext, useContextSelector } from "@com.mgmtp.a12.widgets/widgets-core/lib/context/index.js";

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

const loadThemesFromFolder = (): { [key: string]: DefaultThemeType } => {
    try {
        const context = require.context("../themes", false, /\.json$/);
        const themes: { [key: string]: DefaultThemeType } = {};
        context.keys().forEach((key: string) => {
            const themeName = convertFileNameToDisplayName(key);
            themes[themeName] = context(key) as DefaultThemeType;
        });
        return themes;
    } catch {
        return {};
    }
};

export const THEMES: { [key: string]: DefaultThemeType } = {
    Flat: flatTheme,
    ...loadThemesFromFolder()
};

export function getThemeNames(): string[] {
    return Object.keys(THEMES);
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "Flat",
    setTheme: () => {}
});
ThemeContext.displayName = "ThemeContext";

export const ThemeContextProvider: React.FC<Container> = ({ children }) => {
    const themeNames = getThemeNames();
    const storedTheme = localStorage.getItem(THEME_KEY) ?? themeNames[0];
    const [theme, setTheme] = React.useState(themeNames.includes(storedTheme) ? storedTheme : themeNames[0]);

    const themeContextValue: ThemeContextType = React.useMemo(() => {
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
