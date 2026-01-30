import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import { setup } from "./appsetup";
import { StyledPage } from "./app/page";

const { config, initialStoreActions } = setup();

export const store = config.store;

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
