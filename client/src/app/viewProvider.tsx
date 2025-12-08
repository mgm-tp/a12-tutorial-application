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

import { ReactElement, ComponentType } from "react";

import { FrameFactories } from "@com.mgmtp.a12.client/client-core/lib/core/frame";
import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import { CRUDViews } from "@com.mgmtp.a12.crud/crud-core";
import { ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { TreeEngineFactories } from "@com.mgmtp.a12.treeengine/treeengine-core/lib/extensions/client";
import { DefaultElementLibraryFactories } from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import { withFormElementContexts } from "@com.mgmtp.a12.formengine/formengine-content-elements";

import { store } from "..";

type ViewMap = Record<string, ComponentType<View> | undefined>;

/**
 * Create Application view providers.
 *
 * It defines the available view providers for the application. First, the A12 engines that are specific in the App Model are specified,
 * following the default view providers from A12. The {@link Placeholder} is used as fallback in the case that
 * no view provider has been found for the 'componentName'.
 */
export function createViewProvider(): View.Provider {
    const enginesViewMap = createEnginesViewMap();

    function chainedViewProvider(componentName: string): ComponentType<View> {
        return enginesViewMap[componentName] || FrameFactories.viewProvider(componentName) || Placeholder;
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
        },
        ContentEngine: withFormElementContexts({ ViewComponent: DefaultElementLibraryFactories.ViewComponent })
    };
}

/**
 * Fallback in the case that no view provider has been defined to handle a specific view.
 */
function Placeholder(props: View): ReactElement {
    return <div>No view renderer found: `{props.name}`</div>;
}
