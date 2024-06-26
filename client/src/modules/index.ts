import { UaaActions, UaaOidcModifiedUser, UaaSelectors } from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import { ActivityActions, ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity";
import {
    AppModelAdapterModule,
    Module,
    ModuleRegistryProvider
} from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { StoreFactories } from "@com.mgmtp.a12.client/client-core/lib/core/store";
import { ModelActions } from "@com.mgmtp.a12.client/client-core/lib/core/model";
import { TreeEngineFactories } from "@com.mgmtp.a12.treeengine/treeengine-core/lib/extensions/client";
import { TreeEngineServerConnectorFactories } from "@com.mgmtp.a12.treeengine/treeengine-core/lib/extensions/server-connector";

import { mapAppModelByPermission } from "./utils";
import contactModule from "./contact";
import helpModule from "./help";

export const ALL_MODULES = [
    AppModelAdapterModule,
    TreeEngineFactories.createModule(),
    TreeEngineServerConnectorFactories.createModule(),
    contactModule(),
    helpModule()
];
const moduleRegistry = ModuleRegistryProvider.getInstance();

/**
 * Get all modules.
 */
export const getAllModules = (): Module[] => {
    return ALL_MODULES;
};

/**
 * Initializes module registry on `setModelGraph` action.
 */
export const registerModulesOnSetModelGraphMiddleware = StoreFactories.createMiddleware((api, next, action) => {
    if (ModelActions.setModelGraph.match(action) && !moduleRegistry.getAllModules().length) {
        getAllModules().forEach((module) => moduleRegistry.addModule(module));
    }

    return next(action);
});

/**
 * Middleware that filters and registers application model modules based on the logged-in user's permissions.
 */
export const registerAppModelModulesByPermissionMiddleware = StoreFactories.createMiddleware((api, next, action) => {
    if (ModelActions.addModulesApplicationModels.match(action)) {
        const user = UaaSelectors.user(api.getState()) as UaaOidcModifiedUser;
        const applicationModels = action.payload.models;

        const userAuthorizedAppModels = applicationModels.map((model) => mapAppModelByPermission(model, user));

        return next({
            ...action,
            payload: {
                models: userAuthorizedAppModels
            }
        });
    }

    return next(action);
});

/**
 * On logout, unregisters all modules.
 */
export const unregisterModulesOnLogoutMiddleware = StoreFactories.createMiddleware((api, next, action) => {
    if (UaaActions.loggedOut.match(action)) {
        // The logout action has to be processed first so that any existing activities are removed first
        const result = next(action);

        const moduleIds = moduleRegistry.getAllModules().map(({ id }) => id);
        moduleIds.forEach((id) => moduleRegistry.removeModuleById(id));

        return result;
    }
    return next(action);
});

/**
 * Initialize Webpack Hot module replacement.
 *
 * (!) Webpack needs to know the context of the files therefore is not possible to simply declare
 * modules as variables and all the modules has to be declared explicitly in imports as a string.
 *
 * @example
 * ```
 * // OK
 * import("./person");
 *
 * // NOT WORKING
 * const [person] = ["./person"];
 * import(person);
 * ```
 */
function initializeHMR() {
    if (module.hot) {
        module.hot.accept([], async (updatedDependencies) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const windowStore = window.store!;
            const state = windowStore.getState();
            const dispatch = windowStore.dispatch;

            // For modules imported from current folder updatedDependencies are
            // in format `["./src/modules/<MODULE>/index.ts"]`
            const updatedDependency = updatedDependencies[0].toString().split("/");
            const moduleName = updatedDependency[updatedDependency.length - 2];

            const activities = ActivitySelectors.activities()(state);
            Object.keys(activities).forEach((key) => dispatch(ActivityActions.cancel({ activityId: key })));

            const modules = [...ALL_MODULES];
            const hotIndex = modules.findIndex((m) => m.id.toLowerCase() === `${moduleName}module`);
            let hotModule;

            switch (moduleName) {
                default:
                    break;
            }

            if (hotModule && modules[hotIndex]) {
                // eslint-disable-next-line
                // @ts-ignore
                modules[hotIndex] = hotModule.default();

                modules.forEach((m) => {
                    moduleRegistry.removeModuleById(m.id);
                    moduleRegistry.addModule(m);
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Object.keys(activities).forEach((key) => dispatch(ActivityActions.push({ activity: activities[key]! })));
        });
    }
}

initializeHMR();
