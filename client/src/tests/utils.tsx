import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import { ThemeProvider } from "styled-components";
import { vi } from "vitest";

import {
    defaultDataFormats,
    defaultLocalizerFactory,
    defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import { flatTheme, SizeContext } from "@com.mgmtp.a12.widgets/widgets-core";

import { DEFAULT_TRANSLATIONS } from "../localization";

/** Shared Redux store */
const reducer = (state = {}) => state;
const store = createStore(reducer);

/** Mock dispatch */
const mockDispatch = vi.fn();

/** Replace store's dispatch with mock dispatch */
store.dispatch = mockDispatch;

/** Shared localizer context */
const locale = { language: "en", country: "US" };
const dataFormats = defaultDataFormats(locale);
const conversion = defaultValueConversion(dataFormats);
const localizer = defaultLocalizerFactory({
    locale,
    conversion,
    dataFormats,
    translationSource: DEFAULT_TRANSLATIONS
});

export function renderWithProviders(ui: React.ReactElement, options = {}) {
    const result = render(
        <Provider store={store}>
            <LocalizerContext.Provider value={{ locale, conversion, dataFormats, localizer }}>
                <ThemeProvider theme={flatTheme}>
                    <SizeContext.Provider value={{ currentSize: "lg" }}>{ui}</SizeContext.Provider>
                </ThemeProvider>
            </LocalizerContext.Provider>
        </Provider>,
        options
    );

    return {
        ...result,
        mockDispatch
    };
}
