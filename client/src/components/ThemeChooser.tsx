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

import { memo, type ReactElement, useCallback, useContext } from "react";

import { HeaderTrigger, Icon, SizeContext, List, PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core";

import { THEME_KEY, THEMES, useThemeContext } from "../app/ThemeContext";

interface ThemeItemProps {
    theme: string;
    isActive: boolean;
    onSelect: (theme: string) => void;
}

const ThemeItem = memo(function ThemeItem({ theme, isActive, onSelect }: ThemeItemProps) {
    const handleClick = useCallback(() => onSelect(theme), [onSelect, theme]);

    return (
        <List.Item
            key={theme}
            text={theme}
            onClick={handleClick}
            meta={isActive && <Icon>check</Icon>}
            selected={isActive}
        />
    );
});

export default function ThemeChooser(): ReactElement | null {
    const size = useContext(SizeContext);
    const mobileMode = size.currentSize === "xs" || size.currentSize === "sm";

    const { theme: currentTheme, setTheme } = useThemeContext((context) => context);
    const handleSelect = useCallback(
        (theme: string) => {
            setTheme(theme);
            localStorage.setItem(THEME_KEY, theme);
        },
        [setTheme]
    );

    if (Object.keys(THEMES).length <= 1) {
        return null;
    }

    return (
        <PopUpMenu
            triggerElement={
                <HeaderTrigger
                    graphic="palette"
                    text={mobileMode ? "" : currentTheme.toUpperCase()}
                    meta={mobileMode ? undefined : "arrow_drop_down"}
                    textTitle={currentTheme.toUpperCase()}
                />
            }>
            <List>
                {Object.keys(THEMES).map((item) => (
                    <ThemeItem theme={item} key={item} isActive={currentTheme === item} onSelect={handleSelect} />
                ))}
            </List>
        </PopUpMenu>
    );
}
