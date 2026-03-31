import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import { setup } from "./appsetup";
import { StyledPage } from "./app/page";

const { store, initialActions, Component } = setup();

/**
 * Mount Page into the DOM.
 */
initialActions().then(async () => {
    const mountPoint = document.getElementById("root");
    if (mountPoint) {
        createRoot(mountPoint).render(
            <Provider store={store}>
                <StyledPage>{Component}</StyledPage>
            </Provider>
        );
    }
});
