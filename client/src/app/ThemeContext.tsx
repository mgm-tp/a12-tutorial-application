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
        .replaceAll(/(?:^\.\/|\.json$)/g, "")
        .replaceAll(/[-_]+/g, " ")
        .trim()
        .replaceAll(/\b\w/g, (c) => c.toUpperCase());
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
