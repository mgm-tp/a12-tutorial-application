import { useSelector } from "react-redux";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { DndProvider } from "react-dnd";

import { LoginPage } from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import { ApplicationSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale";
import { NotificationViews } from "@com.mgmtp.a12.client/client-core/lib/core/notification";
import { ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import { DirtyHandlingViews } from "@com.mgmtp.a12.client/client-core/lib/extensions/dirtyHandling";
import { AuthenticationState, UaaSelectors } from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main";
import {
    defaultDataFormats,
    defaultLocalizerFactory,
    defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main";
import {
    A11YLanguageContext,
    getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization";
import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import { DragAndDropUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common";
import { SizeContext, useWindowSize } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector";
import { shouldForwardProp } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/should-forward-prop";
import { DateTimeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/date-time-context";

import { DEFAULT_TRANSLATIONS, LocaleWithName } from "../../localization";

import { AuthenticatedPage } from "./AuthenticatedPage";

/**
 * Base application page.
 *
 * Based on the authentication state Login or Authenticated page is displayed.
 */
export const BasePage = (): React.ReactNode => {
    const { breakPoint } = useWindowSize();
    const authenticatedState = useSelector(UaaSelectors.state);
    const isAuthenticated = authenticatedState === AuthenticationState.AUTHENTICATED;

    const busyState = useSelector(ApplicationSelectors.busy());

    // Initialize localizations
    const locale = useSelector(LocaleSelectors.locale());
    const dateTimeLocale = (locale as LocaleWithName).dateTimeLocale;
    const dataFormats = defaultDataFormats(locale);
    const conversion = defaultValueConversion(dataFormats);
    const localizer = defaultLocalizerFactory({
        locale,
        conversion,
        dataFormats,
        translationSource: DEFAULT_TRANSLATIONS
    });

    const A11yResource = getA11yResource(locale.language);

    return (
        <SizeContext.Provider value={{ currentSize: breakPoint.size }}>
            <DndProvider
                backend={DragAndDropUtils.DefaultDndBackend}
                options={DragAndDropUtils.DefaultDndBackendOptions}>
                <LocalizerContext.Provider value={{ locale, conversion, dataFormats, localizer }}>
                    <DateTimeContext.Provider value={{ locale: dateTimeLocale }}>
                        <A11YLanguageContext.Provider value={A11yResource}>
                            <NotificationViews.Frame>
                                <DirtyHandlingViews.VetoDialog>
                                    <ViewViews.ProgressIndicator progress={busyState ? "loading" : "none"} global>
                                        {isAuthenticated ? (
                                            <AuthenticatedPage />
                                        ) : (
                                            <LoginPage imageURL={"/images/login_bg.jpg"} />
                                        )}
                                    </ViewViews.ProgressIndicator>
                                </DirtyHandlingViews.VetoDialog>
                            </NotificationViews.Frame>
                        </A11YLanguageContext.Provider>
                    </DateTimeContext.Provider>
                </LocalizerContext.Provider>
            </DndProvider>
        </SizeContext.Provider>
    );
};

/**
 * Page with global styles and flat theme applied.
 *
 * Other available themes can be found in the Widgets documentation.
 */
export const StyledPage = (): React.ReactNode => {
    return (
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <ThemeProvider theme={flatTheme}>
                <GlobalStyles />
                <BasePage />
            </ThemeProvider>
        </StyleSheetManager>
    );
};
