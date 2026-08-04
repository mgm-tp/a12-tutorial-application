/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
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
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import type { View } from "@com.mgmtp.a12.client/client-core";
import { CRUDViews } from "@com.mgmtp.a12.crud/crud-core";
import { TreeEngineFactories } from "@com.mgmtp.a12.treeengine/treeengine-core";
import { DefaultElementLibraryFactories } from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import { withFormElementContexts } from "@com.mgmtp.a12.formengine/formengine-content-elements";

type ViewMap = Record<string, View.ViewComponent | undefined>;

/**
 * View map for the engines used in the App Model.
 *
 * Maps view names specified in the App Model Scenes to React components of the respective engine.
 * Each entry must be registered via a corresponding `addView()` call in `appsetup.ts`.
 */
export const enginesViewMap = {
    TreeEngine(props) {
        return <TreeEngineFactories.ViewComponent {...props} />;
    },
    FormEngine(props) {
        return <CRUDViews.FormEngineView {...props} />;
    },
    OverviewEngine(props) {
        return <CRUDViews.OverviewEngineView {...props} />;
    },
    ContentEngine: withFormElementContexts({
        ViewComponent: DefaultElementLibraryFactories.ViewComponent
    })
} satisfies ViewMap;
