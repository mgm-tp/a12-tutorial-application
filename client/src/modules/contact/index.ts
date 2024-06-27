import type { Module, View } from "@com.mgmtp.a12.client/client-core";

import HighlightedDateOverview from "./components/HighlightedDateOverview";

const VIEWS: { [name: string]: View.ViewComponent | undefined } = {
    HighlightedDateOverview
};

function viewComponentProvider(name: string) {
    return VIEWS[name];
}

const module: Module = {
    id: "ContactModule",
    views: () => viewComponentProvider
};

export default module;
