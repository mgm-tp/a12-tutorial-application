import { Module } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { ApplicationModel, ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model";
import { Role, UaaOidcModifiedUser } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

import applicationModel = ModelSelectors.applicationModel;

/**
 * Returns user roles concatenated with the access rights.
 *
 * @param user
 */
export function getUserPermissions(user: UaaOidcModifiedUser) {
    let permissions: string[] | undefined;
    const roles: Role[] | undefined = user?.roles;

    if (roles) {
        permissions = roles
            .flatMap((role) => role.accessRights.map((right) => right.name))
            .concat(roles.map((role) => role.name));
    }

    return permissions;
}

/**
 * Map the given {@link Module} based on the permissions of the {@link ApplicationModel.Module}
 * and the user's permissions.
 *
 * @param currentModule The module for which permissions are being checked.
 * @param currentUser The user whose permissions are being checked.
 * @return A new {@link Module} with filtered module of application model based on user permissions.
 */
export function mapModuleByPermission(currentModule: Module, currentUser: UaaOidcModifiedUser): Module {
    if (currentModule.model) {
        const currentAppModel = currentModule.model(applicationModel());
        const mappedAppModel: ApplicationModel = mapAppModelByPermission(currentAppModel, currentUser);
        return { ...currentModule, model: () => mappedAppModel };
    }

    return currentModule;
}

/**
 * Map the given {@link ApplicationModel} based on the permissions of the {@link ApplicationModel.Module}
 * and the user's permissions.
 *
 * @param currentAppModel The module for which permissions are being checked.
 * @param currentUser The user whose permissions are being checked.
 * @return A new {@link ApplicationModel} with filtered module based on user permissions.
 */
export function mapAppModelByPermission(
    currentAppModel: ApplicationModel,
    currentUser: UaaOidcModifiedUser
): ApplicationModel {
    const roles: string[] = currentUser.roles?.map((role) => role.name) || [];
    const modules = currentAppModel.content.modules;
    const appModelModules: ApplicationModel.Module[] = [];
    modules.forEach((module) => {
        const permissions = module.menu?.permission;
        const hasPermission = roles?.some((role) => permissions?.includes(role));
        if (!permissions || hasPermission) {
            appModelModules.push(module);
        }
    });

    return {
        ...currentAppModel,
        content: {
            ...currentAppModel.content,
            modules: appModelModules
        }
    };
}