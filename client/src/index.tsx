import * as React from "react";
import * as ReactDOM from "react-dom";
import { Store } from "redux";
import { Provider } from "react-redux";

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
    ReactDOM.render(
        <Provider store={store}>
            <StyledPage />
        </Provider>,
        mountPoint
    );
});
