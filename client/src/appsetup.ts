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

import {
    combineFeatures,
    createA12ApplicationSetup,
    addCustomSagas,
    addAdditionalMiddlewares,
    addView,
    addLayout,
    withModel,
    APPLICATION_MODEL_PLACEHOLDER,
    ModelActions,
    type A12ApplicationConfig,
    ApplicationFactories,
    addWrapper
} from "@com.mgmtp.a12.client/client-core";
import { withPlatformModelLoader } from "@com.mgmtp.a12.client/client-core/modelLoader";
import { withDirtyHandling } from "@com.mgmtp.a12.client/client-core/dirtyHandling";
import { withLocalization } from "@com.mgmtp.a12.client/client-core/localization";
import { withNotifications } from "@com.mgmtp.a12.client/client-core/notification";
import { platformAttachmentLoader } from "@com.mgmtp.a12.formengine/formengine-core";
import { withRelationshipFormEngine } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";
import { withOverviewEngine } from "@com.mgmtp.a12.overviewengine/overviewengine-core";
import { withTreeEngine } from "@com.mgmtp.a12.treeengine/treeengine-core";
import { withCRUD } from "@com.mgmtp.a12.crud/crud-core";
import { withDeepLinking } from "@com.mgmtp.a12.client/client-core/deepLinking";
import { withDataServicesConfiguration } from "@com.mgmtp.a12.client/client-core/dataServicesAdapter";
import { withContentEngine } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { DefaultElementLibrary } from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import { withUaa } from "@com.mgmtp.a12.uaa/uaa-authentication-a12-client";

import { registerModulesOnSetModelGraphMiddleware, unregisterModulesOnLogoutMiddleware } from "./modules";
import { isProduction } from "./config";
import { enableReduxDevTools } from "./config/devtools";
import { LoadModelGraphSaga } from "./sagas/loadModelGraph";
import { enginesViewMap } from "./app/EnginesViewMap";
import { CustomApplicationFrameLayout } from "./app/LayoutProvider";
import { DEFAULT_TRANSLATIONS, supportedLocales, getDateTimeResource } from "./localization";
import { AuthBarrier } from "./app/AuthBarrier";

function assertFullyConfigured(
    config: A12ApplicationConfig
): asserts config is A12ApplicationConfig<ApplicationFactories.Config> {
    if (!config.config.model) {
        throw new Error("config.model is required - did you forget withModel()?");
    }
    if (!config.config.modelLoader) {
        throw new Error("config.modelLoader is required - did you forget withPlatformModelLoader()?");
    }
}

export function setup() {
    const initialConfig: A12ApplicationConfig = {
        config: {
            preComputeNewDocuments: true,
            composeEnhancer: isProduction ? undefined : enableReduxDevTools()
        },
        formEngine: {
            sagas: {
                attachmentLoader: platformAttachmentLoader
            }
        },
        localization: {
            supportedLocales,
            translationSource: DEFAULT_TRANSLATIONS,
            getDateTimeResource
        },
        uaa: {
            configuration: {
                serverURL: "/api",
                automaticallyLogin: true
            }
        },
        deepLinking: {
            onlyWelcomePage: true,
            config: {
                applyTriggers: [ModelActions.addModulesApplicationModels]
            }
        }
    };

    const a12Features = combineFeatures(
        withModel(APPLICATION_MODEL_PLACEHOLDER),
        withDataServicesConfiguration,
        withOverviewEngine,
        withRelationshipFormEngine,
        withCRUD,
        withTreeEngine,
        withContentEngine(DefaultElementLibrary.get().id),
        withPlatformModelLoader
    );

    const a12ExtensionFeatures = combineFeatures(withDirtyHandling, withDeepLinking);

    const viewAndLayoutFeatures = combineFeatures(
        addView("TreeEngine", enginesViewMap.TreeEngine),
        addView("FormEngine", enginesViewMap.FormEngine),
        addView("OverviewEngine", enginesViewMap.OverviewEngine),
        addView("ContentEngine", enginesViewMap.ContentEngine),
        addLayout("ApplicationFrame", { component: CustomApplicationFrameLayout }),
        addWrapper(AuthBarrier)
    );

    const applicationFeatures = combineFeatures(
        viewAndLayoutFeatures,
        addAdditionalMiddlewares(registerModulesOnSetModelGraphMiddleware, unregisterModulesOnLogoutMiddleware),
        addCustomSagas(LoadModelGraphSaga)
    );

    const configured = combineFeatures(
        withLocalization,
        withNotifications,
        withUaa,
        a12Features,
        a12ExtensionFeatures,
        applicationFeatures
    )(initialConfig);

    assertFullyConfigured(configured);

    const { store, initialActions, Component } = createA12ApplicationSetup(configured);

    return { store, initialActions, Component };
}
