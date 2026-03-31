import type { PropsWithChildren, ReactElement } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { DndProvider } from "react-dnd";

import { ApplicationSelectors } from "@com.mgmtp.a12.client/client-core";
import { NotificationViews } from "@com.mgmtp.a12.client/client-core";
import { ViewViews } from "@com.mgmtp.a12.client/client-core";
import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core";
import { DragAndDropUtils } from "@com.mgmtp.a12.widgets/widgets-core";
import { SizeContext, useWindowSize } from "@com.mgmtp.a12.widgets/widgets-core";
import { shouldForwardProp } from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeContextProvider, THEMES, useThemeContext } from "../themeContext";

/**
 * Base application page providing UI infrastructure: size context, drag-and-drop, notifications, and progress indicator.
 */
const BasePage = ({ children }: PropsWithChildren): ReactElement => {
    const { breakPoint } = useWindowSize();
    const busyState = useSelector(ApplicationSelectors.busy());
    const sizeContextValue = useMemo(() => ({ currentSize: breakPoint.size }), [breakPoint.size]);

    return (
        <SizeContext.Provider value={sizeContextValue}>
            <DndProvider
                backend={DragAndDropUtils.DefaultDndBackend}
                options={DragAndDropUtils.DefaultDndBackendOptions}>
                <NotificationViews.Frame>
                    <ViewViews.ProgressIndicator progress={busyState ? "loading" : "none"} global>
                        {children}
                    </ViewViews.ProgressIndicator>
                </NotificationViews.Frame>
            </DndProvider>
        </SizeContext.Provider>
    );
};

const ThemedPageWrapper = ({ children }: PropsWithChildren) => {
    const theme = useThemeContext((context) => context.theme);
    return (
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <ThemeProvider theme={THEMES[theme] ?? THEMES.Flat}>
                <GlobalStyles />
                <BasePage>{children}</BasePage>
            </ThemeProvider>
        </StyleSheetManager>
    );
};

/**
 * Page with global styles and flat theme applied.
 *
 * Other available themes can be found in the Widgets documentation.
 */
export const StyledPage = ({ children }: PropsWithChildren): ReactElement => {
    return (
        <ThemeContextProvider>
            <ThemedPageWrapper>{children}</ThemedPageWrapper>
        </ThemeContextProvider>
    );
};
