import { describe, beforeEach, vi, expect, it } from "vitest";
import type { MiddlewareAPI } from "redux";

import { ModuleRegistryProvider, ModelActions } from "@com.mgmtp.a12.client/client-core";
import { UaaActions } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

import {
    getAllModules,
    registerModulesOnSetModelGraphMiddleware,
    unregisterModulesOnLogoutMiddleware
} from "../../modules";

import { testModules } from "../constants";

describe("Modules", () => {
    const moduleRegistry = ModuleRegistryProvider.getInstance();
    const api = {
        getState: vi.fn(),
        dispatch: vi.fn()
    } as unknown as MiddlewareAPI;
    const next = vi.fn((action) => action);

    beforeEach(() => {
        // Clear all modules from registry
        const moduleIds = moduleRegistry.getAllModules().map(({ id }) => id);
        moduleIds.forEach((id) => moduleRegistry.removeModuleById(id));
    });

    it("should register modules when model graph is set and continue with action", () => {
        const action = {
            type: "MODEL_SET_MODEL_GRAPH"
        };

        // Get expected modules and set up spies to monitor the middleware behavior
        const modulesToRegister = getAllModules();
        const matchSpy = vi.spyOn(ModelActions.setModelGraph, "match").mockReturnValue(true);
        const addModuleSpy = vi.spyOn(moduleRegistry, "addModule");

        // Execute the register modules middleware
        registerModulesOnSetModelGraphMiddleware(api)(next)(action);

        // Middleware should recognise the action and register every module exactly once
        expect(matchSpy).toHaveBeenCalledWith(action);
        expect(addModuleSpy).toHaveBeenCalledTimes(modulesToRegister.length);
        modulesToRegister.forEach((module) => {
            expect(addModuleSpy).toHaveBeenCalledWith(module);
        });

        // Registry should hold the full list and the action should keep flowing
        expect(moduleRegistry.getAllModules()).toHaveLength(modulesToRegister.length);
        expect(next).toHaveBeenCalledWith(action);

        // Clean up spies
        matchSpy.mockRestore();
        addModuleSpy.mockRestore();
    });

    it("should unregister modules after logout and continue with action", () => {
        // Seed the registry with modules
        testModules.forEach((module) => moduleRegistry.addModule(module));
        expect(moduleRegistry.getAllModules().length).toBe(4);

        // Create logout action
        const action = UaaActions.loggedOut();

        // Set up spies to monitor the middleware behavior
        const matchSpy = vi.spyOn(UaaActions.loggedOut, "match").mockReturnValue(true);
        const removeModuleSpy = vi.spyOn(moduleRegistry, "removeModuleById");

        // Execute the logout middleware
        unregisterModulesOnLogoutMiddleware(api)(next)(action);

        // Verify all modules were properly unregistered
        expect(matchSpy).toHaveBeenCalledWith(action);
        expect(next).toHaveBeenCalledWith(action);
        expect(removeModuleSpy).toHaveBeenCalledTimes(4);
        expect(moduleRegistry.getAllModules().length).toBe(0);

        // Clean up spies
        matchSpy.mockRestore();
        removeModuleSpy.mockRestore();
    });
});
