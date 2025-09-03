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
import { platformAttachmentLoader } from "@com.mgmtp.a12.formengine/formengine-core";
import { withRelationshipFormEngine } from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";
import { withOverviewEngine } from "@com.mgmtp.a12.overviewengine/overviewengine-core";
import { withTreeEngine } from "@com.mgmtp.a12.treeengine/treeengine-core";
import { withCRUD } from "@com.mgmtp.a12.crud/crud-core";
import { withUaa } from "@com.mgmtp.a12.uaa/uaa-authentication-a12-client";
import { withDeepLinking } from "@com.mgmtp.a12.client/client-core/deepLinking";
import { withDataServicesConfiguration } from "@com.mgmtp.a12.client/client-core/dataServicesAdapter";
import { withContentEngine } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { DefaultElementLibrary } from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import { withWorkflows, WorkflowsFactories } from "@com.mgmtp.a12.workflows/workflows-core/lib";

import { registerModulesOnSetModelGraphMiddleware, unregisterModulesOnLogoutMiddleware } from "./modules";
import { isProduction } from "./config";
import { enableReduxDevTools } from "./config/devtools";
import { LoadModelGraphSaga } from "./sagas/loadModelGraph";
import { enginesViewMap } from "./app/viewProvider";
import { CustomApplicationFrameLayout } from "./app/layoutProvider";
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
        overviewEngine: {
            dataLoader: WorkflowsFactories.createDataLoader()
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
        withTreeEngine,
        withDataServicesConfiguration,
        withOverviewEngine,
        withRelationshipFormEngine,
        withCRUD,
        withContentEngine(DefaultElementLibrary.get().id),
        withPlatformModelLoader,
        withWorkflows
    );

    const a12ExtensionFeatures = combineFeatures(withLocalization, withDirtyHandling, withDeepLinking);

    const viewAndLayoutFeatures = combineFeatures(
        addView("TreeEngine", enginesViewMap.TreeEngine),
        addView("FormEngine", enginesViewMap.FormEngine),
        addView("OverviewEngine", enginesViewMap.OverviewEngine),
        addView("ContentEngine", enginesViewMap.ContentEngine),
        addLayout("ApplicationFrame", { component: CustomApplicationFrameLayout })
    );

    const applicationFeatures = combineFeatures(
        viewAndLayoutFeatures,
        addAdditionalMiddlewares(registerModulesOnSetModelGraphMiddleware, unregisterModulesOnLogoutMiddleware),
        withUaa,
        addWrapper(AuthBarrier, "inner"),
        addCustomSagas(LoadModelGraphSaga)
    );

    const configured = combineFeatures(a12Features, a12ExtensionFeatures, applicationFeatures)(initialConfig);
    assertFullyConfigured(configured);

    const { store, initialActions, Component } = createA12ApplicationSetup(configured);

    return { store, initialActions, Component };
}
