import React, { ReactElement } from "react";

import { FrameFactories } from "@com.mgmtp.a12.client/client-core/lib/core/frame";
import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import { CRUDViews } from "@com.mgmtp.a12.crud/crud-core";
import { ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { StaticPageFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/static-page";
import { TreeEngineFactories } from "@com.mgmtp.a12.treeengine/treeengine-core/lib/extensions/client";

import { store } from "..";

type ViewMap = Record<string, React.ComponentType<View> | undefined>;

/**
 * Create Application view providers.
 *
 * It defines the available view providers for the application. First, the A12 engines that are specific in the App Model are specified,
 * following the static and default view providers from A12. The {@link Placeholder} is used as fallback in the case that
 * no view provider has been found for the 'componentName'.
 */
export function createViewProvider(): View.Provider {
    const enginesViewMap = createEnginesViewMap();
    const staticPageComponentProvider = StaticPageFactories.createViewProvider();

    function chainedViewProvider(componentName: string): React.ComponentType<View> {
        return (
            enginesViewMap[componentName] ||
            staticPageComponentProvider(componentName) ||
            FrameFactories.viewProvider(componentName) ||
            Placeholder
        );
    }

    return ModuleRegistryProvider.getViewProvider(store.getState(), chainedViewProvider);
}

/**
 * Create view providers for Form and Overview Engine.
 *
 * Based on the view names specified in the App Model, these are mapped to React components of the respective engine.
 * These take care of rendering the content for forms and overviews.
 */
function createEnginesViewMap(): ViewMap {
    return {
        TreeEngine(props) {
            return <TreeEngineFactories.ViewComponent {...props} />;
        },
        FormEngine(props) {
            return <CRUDViews.FormEngineView {...props} />;
        },
        OverviewEngine(props) {
            return <CRUDViews.OverviewEngineView {...props} timeMode="24h" />;
        }
    };
}

/**
 * Fallback in the case that no view provider has been defined to handle a specific view.
 */
function Placeholder(props: View): ReactElement {
    return <div>No view renderer found: `{props.name}`</div>;
}
