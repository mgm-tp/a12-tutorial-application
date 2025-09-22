import React, { useContext } from "react";

import { HeaderTrigger } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list";
import { PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu";

import { getThemeNames, THEME_KEY, THEMES, useThemeContext } from "../app/themeContext";

interface ThemeItemProps {
    theme: string;
    isActive: boolean;
    onSelect: (theme: string) => void;
}

const ThemeItem = React.memo(function ThemeItem({ theme, isActive, onSelect }: ThemeItemProps) {
    const handleClick = React.useCallback(() => onSelect(theme), [onSelect, theme]);

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

export default function ThemeChooser(): React.ReactNode | null {
    const size = useContext(SizeContext);
    const mobileMode = size.currentSize === "xs" || size.currentSize === "sm";

    const { theme: currentTheme, setTheme } = useThemeContext((context) => context);
    const handleSelect = React.useCallback(
        (theme: string) => {
            setTheme(theme);
            localStorage.setItem(THEME_KEY, theme);
        },
        [setTheme]
    );

    if (getThemeNames().length <= 1) {
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
