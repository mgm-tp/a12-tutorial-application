import { Module } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model";
import { Role, UaaExtendedUser } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

import applicationModel = ModelSelectors.applicationModel;

/**
 * Returns user roles concatenated with the access rights.
 *
 * @param user
 */
export function getUserPermissions(user: UaaExtendedUser | undefined) {
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
 * Returns permissions for each module defined in the Application Model of the chosen module.
 *
 * @param currentModule
 */
export function getAppmodelPermissions(currentModule: Module) {
    const modelPermissions = new Map<string, string | undefined>();

    if (currentModule.model) {
        currentModule
            .model(applicationModel())
            .content.modules.forEach((module) => modelPermissions.set(module.name, module.menu?.permission));
    }

    return modelPermissions;
}

/**
 * Returns true if there is a match between module permissions and user permissions.
 *
 * Note: In the Project Template example implementation, this function always returns true
 * because the Project Template does not restrict permissions to modules in the App Model.
 *
 * @param currentModule The module for which permissions are being checked.
 * @param currentUser The user whose permissions are being checked.
 * @returns A boolean value indicating whether the user has permissions for the specified module.
 */
export function appmodelUserPermissionFilter(currentModule: Module, currentUser: UaaExtendedUser): boolean {
    //Flatten for the module-based approach used in the Project Template
    const appmodelPermissions = Array.from(getAppmodelPermissions(currentModule).values()).filter(Boolean);
    const userPermissions: string[] | undefined = getUserPermissions(currentUser);

    if (appmodelPermissions.length > 0) {
        return userPermissions
            ? appmodelPermissions.some((appmodelPermission) => userPermissions.includes(<string>appmodelPermission))
            : false;
    } else {
        return true;
    }
}
