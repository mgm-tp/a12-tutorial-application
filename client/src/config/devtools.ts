import type { ComposeEnhancer } from "@com.mgmtp.a12.client/client-core/lib/core/application/";

declare let window: Window & {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: ComposeEnhancer;
};

export function enableReduxDevTools(): ComposeEnhancer | undefined {
    return typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : undefined;
}
