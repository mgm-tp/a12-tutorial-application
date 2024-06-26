import type { Module, View } from "@com.mgmtp.a12.client/client-core";

import MarkdownPage from "./components/MarkdownPage";

const VIEWS: { [name: string]: View.ViewComponent | undefined } = {
    HelpPage: MarkdownPage
};

function viewComponentProvider(name: string) {
    return VIEWS[name];
}

const module: Module = {
    id: "HelpModule",
    views: () => viewComponentProvider
};

export default module;
