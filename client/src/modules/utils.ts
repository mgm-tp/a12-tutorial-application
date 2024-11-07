import { ApplicationModel } from "@com.mgmtp.a12.client/client-core/lib/core/model";
import { Role } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

/**
 * Map the given {@link ApplicationModel} based on the permissions of the {@link ApplicationModel.Module}
 * and the user's permissions.
 *
 * @param currentAppModel The module for which permissions are being checked.
 * @param roles The roles of user who is being checked.
 * @return A new {@link ApplicationModel} with filtered module based on user permissions.
 */
export function mapAppModelByPermission(currentAppModel: ApplicationModel, roles: Role[]): ApplicationModel {
    const modules = currentAppModel.content.modules;
    const appModelModules: ApplicationModel.Module[] = [];
    modules.forEach((module) => {
        const permissions = module.menu?.permission;
        const hasPermission = roles.some((role) => permissions?.includes(role.name));
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
