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
