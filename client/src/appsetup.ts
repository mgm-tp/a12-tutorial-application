import { UaaActions, UaaClient, UaaMiddlewares, UaaReducer } from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity";
import { ApplicationFactories, ApplicationSetup } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { DataHandlers } from "@com.mgmtp.a12.client/client-core/lib/core/data";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale";
import { ModelActions } from "@com.mgmtp.a12.client/client-core/lib/core/model";
import {
    createEmptyDocumentDataProvider,
    formEngineDataReducers,
    formEngineSagas
} from "@com.mgmtp.a12.client/client-core/lib/extensions/form-engine";
import { CRUDFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/crud";
import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/dirtyHandling";
import { configure } from "@com.mgmtp.a12.client/client-core/lib/extensions/platform-server-connectors";
import { DeepLinkingFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/deep-linking";
import { cddDataProvider, cdmSagas, createCdmMiddlewares } from "@com.mgmtp.a12.client/client-core/lib/extensions/cdm";
import { dgReducerFactory } from "@com.mgmtp.a12.client/client-core/lib/extensions/documentGraph/redux";
import {
    cddDataHolderReducerExtension,
    cddReducers
} from "@com.mgmtp.a12.client/client-core/lib/extensions/cdm/cdd/redux";
import {
    RelationshipFactories,
    RelationshipReducers
} from "@com.mgmtp.a12.client/client-core/lib/extensions/relationship";

import * as appModel from "./appmodel.json";
import { registerModulesOnLoginMiddleware, unregisterModulesOnLogoutMiddleware } from "./modules";
import { setLanguageSelectedInLoginForm } from "./uaa/sagas";
import { isProduction } from "./config";
import { devToolMiddleware, enableReduxDevTools } from "./config/devtools";
import { LoadModelGraphSaga } from "./sagas/loadModelGraph";

let config: ApplicationSetup;

export const platformServerConnectors = configure({
    localeProvider: () => LocaleSelectors.locale()(config.store.getState())
});

export function setup(): {
    config: ApplicationSetup;
    initialStoreActions(): Promise<void>;
} {
    const dataHandlers: DataHandlers = {
        dataEditors: [],
        dataLoaders: platformServerConnectors.loaders.dataLoaders,
        dataProviders: [
            cddDataProvider,
            RelationshipFactories.createRelationshipDataProvider(),
            createEmptyDocumentDataProvider()
        ]
    };

    config = ApplicationFactories.createApplicationSetup({
        model: appModel,
        modelLoaders: [],
        newModelLoader: platformServerConnectors.loaders.newModelLoader,
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
        overridePlatformSagas: [...DirtyHandlingFactories.createSagas()],
        customSagas: [
            ...cdmSagas,
            ...RelationshipFactories.createSagas({ dataHandlers }),
            ...CRUDFactories.createSagas(),
            ...formEngineSagas,
            LoadModelGraphSaga,
            setLanguageSelectedInLoginForm,
            DeepLinkingFactories.createWelcomePageSaga({ applyTriggers: [ModelActions.setModelGraph] })
        ],
        preComputeNewDocuments: true,
        composeEnhancer: isProduction ? undefined : enableReduxDevTools(),
        additionalMiddlewares: [
            ...createCdmMiddlewares(),
            CRUDFactories.createCRUDMiddleware(),
            registerModulesOnLoginMiddleware,
            unregisterModulesOnLogoutMiddleware,
            ...platformServerConnectors.middlewares,
            devToolMiddleware(),
            ...UaaMiddlewares()
        ],
        dataReducers: [
            ...formEngineDataReducers,
            ...RelationshipReducers.dataReducers,
            ...dgReducerFactory(cddDataHolderReducerExtension),
            ...cddReducers
        ],
        reducerMap: {
            uaa: UaaReducer
        }
    });

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
            await UaaClient.init({
                serverURL: `/api`,
                automaticallyLogin: true,
                store: config.store
            });

            const uaaLocalClient = UaaClient.getLocalClient();
            uaaLocalClient.initConnector();
            await uaaLocalClient.restoreAuthenticationState(config.store.dispatch);
        }
    };
}
