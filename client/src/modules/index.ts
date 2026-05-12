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

import { UaaActions } from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import {
    AppModelAdapterModule,
    type Module,
    ModuleRegistryProvider,
    StoreFactories,
    ModelActions
} from "@com.mgmtp.a12.client/client-core";
import { FormElementsLibrary } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import {
    DefaultElementLibrary,
    DefaultElementLibraryFactories
} from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging";

import { isModule } from "../utils/guards";

import { modules } from "./modules.generated";

const logger = LoggerFactory.getLogger("PT/modules");

const ALL_MODULES: Module[] = [
    AppModelAdapterModule,
    DefaultElementLibraryFactories.createModule({
        library: {
            ...DefaultElementLibrary.get(),
            modules: [...DefaultElementLibrary.get().modules, ...FormElementsLibrary.modules]
        }
    }),
    ...modules.filter(isModule)
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
    if (ModelActions.setModelGraph.match(action)) {
        const registeredModules = moduleRegistry.getAllModules();

        if (registeredModules.length > 0) {
            logger.error(
                "Module registry already has modules registered with the following ids:",
                registeredModules.map((module) => module.id)
            );
        } else {
            getAllModules().forEach((module) => moduleRegistry.addModule(module));
        }
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
