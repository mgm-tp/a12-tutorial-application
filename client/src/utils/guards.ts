import type { Module } from "@com.mgmtp.a12.client/client-core";
import { type DefaultThemeType, defaultTheme } from "@com.mgmtp.a12.widgets/widgets-core";

export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isModule(value: unknown): value is Module {
    return isObject(value) && "id" in value && typeof value.id === "string";
}

export function isTheme(theme: unknown): theme is DefaultThemeType {
    if (!isObject(theme)) {
        return false;
    }

    return Object.entries(defaultTheme).every(
        ([key, defaultValue]) => key in theme && typeof theme[key] === typeof defaultValue
    );
}
