/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (C) 2012-2025 mgm technology partners GmbH
 * All rights reserved. Rights of use are granted under the selected license.
 *
 * Dual License
 * ------------
 * This file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
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
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import { Store } from "redux";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import { setup } from "./appsetup";
import { StyledPage } from "./app/page";

declare global {
    interface Window {
        store: Store;
    }
}

const { config, initialStoreActions } = setup();

export const store = config.store;

// Save store for webpack development hot mode
if (module.hot) {
    window.store = store;
}

/**
 * Mount Page into the DOM.
 */
initialStoreActions().then(async () => {
    const mountPoint = document.getElementById("root");
    if (mountPoint) {
        createRoot(mountPoint).render(
            <Provider store={store}>
                <StyledPage />
            </Provider>
        );
    }
});
