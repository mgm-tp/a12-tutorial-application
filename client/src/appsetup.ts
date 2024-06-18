import { UaaClient } from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import {
    UaaActions,
    UaaClientConfiguration,
    UaaMiddlewares,
    UaaReducer
} from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity";
import { ApplicationFactories, ApplicationSetup } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { DataHandler } from "@com.mgmtp.a12.client/client-core/lib/core/data";
import { APPLICATION_MODEL_PLACEHOLDER, ModelActions } from "@com.mgmtp.a12.client/client-core/lib/core/model";
import { createPlatformServerModelLoader } from "@com.mgmtp.a12.client/client-core/lib/extensions/modelLoader";
import {
    createEmptyDocumentDataProvider,
    formEngineDataReducers,
    FormModelProcessor,
    platformAttachmentLoader,
    platformSingleDocumentDataProvider
} from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions";
import { CRUDFactories } from "@com.mgmtp.a12.crud/crud-core";
import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/dirtyHandling";
import {
    cddDataHolderReducerExtension,
    cddDataProvider,
    cddReducers,
    cdmSagas,
    createCdmMiddlewares,
    dgReducerFactory,
    RelationshipFactories,
    RelationshipReducers
} from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";
import { OverviewEngineFactories } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/client-extensions";
import { DeepLinkingFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/deep-linking";

import {
    registerAppModelModulesByPermissionMiddleware,
    registerModulesOnSetModelGraphMiddleware,
    unregisterModulesOnLogoutMiddleware
} from "./modules";
import { setLanguageSelectedInLoginForm, setRolesForUserAfterTokenRefresh } from "./uaa/sagas";
import { isProduction } from "./config";
import { devToolMiddleware, enableReduxDevTools } from "./config/devtools";
import { LoadModelGraphSaga } from "./sagas/loadModelGraph";

let config: ApplicationSetup;

export function setup(): {
    config: ApplicationSetup;
    initialStoreActions(): Promise<void>;
} {
    const dataHandlers: DataHandler[] = [
        cddDataProvider,
        createEmptyDocumentDataProvider(),
        RelationshipFactories.createRelationshipDataProvider(),
        ...OverviewEngineFactories.createDataProviders(),
        platformSingleDocumentDataProvider
    ];

    config = ApplicationFactories.createApplicationSetup({
        model: APPLICATION_MODEL_PLACEHOLDER,
        modelLoader: createPlatformServerModelLoader({ modelProcessors: [FormModelProcessor] }),
        applicationBusyTriggers: {
            start: [UaaActions.loggingInLocal],
            end: [UaaActions.loggedIn, UaaActions.loginFailed]
        },
        applicationResetTriggers: {
            resetRequested: [UaaActions.logoutRequested],
            resetConfirmed: UaaActions.loggingOut(),
            reset: [UaaActions.loggedOut]
        },
        dataHandlers,
        overridePlatformSagas: [
            ...DirtyHandlingFactories.createSagas(),
            ...OverviewEngineFactories.createApplicationSagas()
        ],
        customSagas: [
            ...CRUDFactories.createSagas(),
            ...RelationshipFactories.createSagas({ dataHandlers }),
            LoadModelGraphSaga,
            ...cdmSagas({ attachmentLoader: platformAttachmentLoader }),
            setLanguageSelectedInLoginForm,
            setRolesForUserAfterTokenRefresh,
            DeepLinkingFactories.createWelcomePageSaga({ applyTriggers: [ModelActions.addModulesApplicationModels] })
        ],
        preComputeNewDocuments: true,
        composeEnhancer: isProduction ? undefined : enableReduxDevTools(),
        additionalMiddlewares: [
            ...createCdmMiddlewares(),
            ...OverviewEngineFactories.createMiddlewares(),
            CRUDFactories.createCRUDMiddleware(),
            registerModulesOnSetModelGraphMiddleware,
            registerAppModelModulesByPermissionMiddleware,
            unregisterModulesOnLogoutMiddleware,
            devToolMiddleware(),
            ...UaaMiddlewares()
        ],
        dataReducers: [
            ...formEngineDataReducers,
            ...RelationshipReducers.dataReducers,
            ...OverviewEngineFactories.createDataReducers(),
            ...dgReducerFactory(cddDataHolderReducerExtension),
            ...cddReducers
        ],
        reducerMap: {
            uaa: UaaReducer
        }
    });
    const clientConfiguration: UaaClientConfiguration = {
        serverURL: "/api",
        automaticallyLogin: true,
        store: config.store
    };
    /*
     * Listen to the window.onbeforeunload event to trigger a dialog
     * if there are dirty or locked activities when the application gets closed.
     */
    window.onbeforeunload = () => {
        // Show the dialog if there are dirty or locked activities.
        const dirtySubTree = ActivitySelectors.allDirtyOrLockedActivities()(config.store.getState());
        if (dirtySubTree.length > 0) {
            /* This string will not be shown in most modern browser versions,
             * instead a browser specific message will be shown:
             * https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload#Browser_compatibility
             *
             * Current Firefox (version 100.0.x) and Chromium (version 101.0.x) display a browser-specific alert box.
             */
            return "Changes you made may not be saved.";
        } else {
            return undefined;
        }
    };
    return {
        config,
        initialStoreActions: async () => {
            await UaaClient.init(clientConfiguration);
            const uaaLocalClient = UaaClient.getLocalClient();
            uaaLocalClient.initConnector();
            await uaaLocalClient.restoreAuthenticationState(config.store.dispatch);
        }
    };
}
