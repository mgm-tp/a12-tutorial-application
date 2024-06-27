import React from "react";

import { Module } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";

import HighlightedDateOverview from "./components/HighlightedDateOverview";

const VIEWS: { [name: string]: React.ComponentType<View> | undefined } = {
    HighlightedDateOverview
};

function viewComponentProvider(name: string) {
    return VIEWS[name];
}

const module = (): Module => ({
    id: "ContactModule",
    views: () => viewComponentProvider
});

export default module;
