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

import type { PropsWithChildren, ReactElement } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { DndProvider } from "react-dnd";

import { ApplicationSelectors, ViewViews } from "@com.mgmtp.a12.client/client-core";
import {
    GlobalStyles,
    DragAndDropUtils,
    SizeContext,
    useWindowSize,
    shouldForwardProp
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeContextProvider, THEMES, useThemeContext } from "../ThemeContext";

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
                <ViewViews.ProgressIndicator progress={busyState ? "loading" : "none"} global>
                    {children}
                </ViewViews.ProgressIndicator>
            </DndProvider>
        </SizeContext.Provider>
    );
};

const ThemedPageWrapper = ({ children }: PropsWithChildren) => {
    const theme = useThemeContext((context) => context.theme);
    return (
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <ThemeProvider theme={THEMES[theme] ?? THEMES.Base}>
                <GlobalStyles />
                <BasePage>{children}</BasePage>
            </ThemeProvider>
        </StyleSheetManager>
    );
};

/**
 * Page with global styles and base theme applied.
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
