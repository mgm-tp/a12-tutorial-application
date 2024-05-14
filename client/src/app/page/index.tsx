import React from "react";
import { useSelector } from "react-redux";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { DndProvider } from "react-dnd";

import { ApplicationSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale";
import { createApplicationLocalizer } from "@com.mgmtp.a12.client/client-core/lib/core/locale/localizer";
import { ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model";
import { NotificationViews } from "@com.mgmtp.a12.client/client-core/lib/core/notification";
import { ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import { DirtyHandlingViews } from "@com.mgmtp.a12.client/client-core/lib/extensions/dirtyHandling";
import { UaaSelectors, AuthenticationState, LoginPage } from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main";
import { defaultDataFormats } from "@com.mgmtp.a12.utils/utils-localization/lib/main";
import {
    A11YLanguageContext,
    getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization";
import { SizeContext, SizeDetectorProps, withSizeDetector } from "@com.mgmtp.a12.widgets/widgets-core";
import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import { DragAndDropUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common";

import { DEFAULT_TRANSLATIONS } from "../../localization";

import { AuthenticatedPage } from "./AuthenticatedPage";

/**
 * Base application page.
 *
 * Based on the authentication state Login or Authenticated page is displayed.
 */
export const BasePage = (): JSX.Element => {
    const authenticatedState = useSelector(UaaSelectors.state);
    const isAuthenticated = authenticatedState === AuthenticationState.AUTHENTICATED;

    const busyState = useSelector(ApplicationSelectors.busy());

    // Initialize localizations
    const documentModelMap = useSelector(ModelSelectors.allDocumentModels());
    const locale = useSelector(LocaleSelectors.locale());
    const dataFormats = defaultDataFormats(locale);
    const localizer = createApplicationLocalizer(locale, documentModelMap, dataFormats, DEFAULT_TRANSLATIONS);

    const A11yResource = getA11yResource(locale.language);

    return (
        <DndProvider backend={DragAndDropUtils.DefaultDndBackend} options={DragAndDropUtils.DefaultDndBackendOptions}>
            <LocalizerContext.Provider value={{ locale, dataFormats, localizer }}>
                <A11YLanguageContext.Provider value={A11yResource}>
                    <NotificationViews.Frame>
                        <DirtyHandlingViews.VetoDialog>
                            <ViewViews.ProgressIndicator progress={busyState ? "loading" : "none"}>
                                {isAuthenticated ? (
                                    <AuthenticatedPage />
                                ) : (
                                    <LoginPage imageURL={"/images/login_bg.jpg"} localizer={localizer} />
                                )}
                            </ViewViews.ProgressIndicator>
                        </DirtyHandlingViews.VetoDialog>
                    </NotificationViews.Frame>
                </A11YLanguageContext.Provider>
            </LocalizerContext.Provider>
        </DndProvider>
    );
};

const PageWithSizeDetection = withSizeDetector(BasePage);
/**
 * Resizable Page with size detection.
 */
export const ResizeablePage = (): JSX.Element => {
    const [size, setSize] = React.useState<SizeDetectorProps.Size>("lg");
    const onSizeChange = (breakPoint: SizeDetectorProps.BreakPoint): void => {
        setSize(breakPoint.size);
    };

    return (
        <SizeContext.Provider value={{ currentSize: size }}>
            <PageWithSizeDetection onSizeChange={onSizeChange} />
        </SizeContext.Provider>
    );
};

/**
 * Page with global styles and flat theme applied.
 *
 * Other available themes can be found in the Widgets documentation.
 */
export const StyledPage = (): JSX.Element => {
    return (
        <StyleSheetManager disableVendorPrefixes>
            <ThemeProvider theme={flatTheme}>
                <GlobalStyles />
                <ResizeablePage />
            </ThemeProvider>
        </StyleSheetManager>
    );
};
