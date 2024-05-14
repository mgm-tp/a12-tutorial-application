import { MiddlewareAPI } from "redux";

import { UaaActions } from "@com.mgmtp.a12.uaa/uaa-authentication-client";
import { ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core/lib/core/application";

import * as modules from "./";
import { registerModulesOnLoginMiddleware, unregisterModulesOnLogoutMiddleware } from "./";

jest.mock("./person", jest.fn);

describe("Modules", () => {
    const moduleRegistry = ModuleRegistryProvider.getInstance();
    const api = {} as MiddlewareAPI;
    const next = jest.fn((action) => action);

    it("should register modules after login and continue with action", () => {
        const action = UaaActions.loggedIn;
        const getAllModulesSpy = jest
            .spyOn(modules, "getAllModules")
            .mockReturnValue([{ id: "MODULE_1" }, { id: "MODULE_2" }]);
        const addModuleSpy = jest.spyOn(moduleRegistry, "addModule");

        const result = registerModulesOnLoginMiddleware(api)(next)(action);

        expect(getAllModulesSpy).toBeCalledTimes(1);
        expect(addModuleSpy).toBeCalledTimes(4);
        expect(moduleRegistry.getAllModules().length).toBe(4);
        expect(result).toEqual(action);
    });

    it("should unregister modules after logout and continue with action", () => {
        const action = UaaActions.loggedOut;
        const removeModuleSpy = jest.spyOn(moduleRegistry, "removeModuleById");

        const result = unregisterModulesOnLogoutMiddleware(api)(next)(action);

        expect(removeModuleSpy).toBeCalledTimes(4);
        expect(moduleRegistry.getAllModules().length).toBe(0);
        expect(result).toEqual(action);
    });
});
