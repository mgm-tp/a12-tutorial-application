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
