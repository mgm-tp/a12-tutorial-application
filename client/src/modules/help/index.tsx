import React from "react";

import { Module } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";

import MarkdownPage from "./components/MarkdownPage";

const VIEWS: { [name: string]: React.ComponentType<View> | undefined } = {
    HelpPage: MarkdownPage
};

function viewComponentProvider(name: string) {
    return VIEWS[name];
}

const module = (): Module => ({
    id: "HelpModule",
    views: () => viewComponentProvider
});

export default module;
