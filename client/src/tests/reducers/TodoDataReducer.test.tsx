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

import { describe, it, expect } from "vitest";

import type { Activity, ActivityActions } from "@com.mgmtp.a12.client/client-core";

import { addTodo, type TodoList, AddTodoDataReducer } from "./TodoDataReducer";

describe("TodoDataReducer", () => {
    // Setup mock data holders for testing
    const mockDataHolder: Activity.DataHolder = {
        descriptor: {
            use: "todo-list",
            id: "todo-holder-1"
        },
        data: {
            todos: ["Learn A12", "Write tests"]
        },
        slices: {},
        dirty: false,
        loadingState: "loaded",
        savingState: "not_saved"
    };

    const nonTodoDataHolder: Activity.DataHolder = {
        descriptor: { use: "user-profile", id: "user-1" },
        data: { name: "John" },
        slices: {},
        dirty: false,
        loadingState: "loaded",
        savingState: "not_saved"
    };

    it("should verify to-do reducer functionalities", () => {
        // Test 1: Verify action creation with required A12 activity payload
        const action = addTodo({
            activityId: "test-activity", // Required by A12 ActivityActionPayload
            todo: "Create tutorial"
        });

        expect(action.type).toBe("Tutorial/ADD_TODO");
        expect(action.payload.activityId).toBe("test-activity");
        expect(action.payload.todo).toBe("Create tutorial");

        // Test 2: Verify reducer only processes matching data holders
        const mixedDataHolders = [mockDataHolder, nonTodoDataHolder];
        const result = AddTodoDataReducer.reduce(mixedDataHolders, action) as Activity.DataHolder[];

        // Verify no data holders were added or removed
        expect(result).toHaveLength(2);

        // Find and verify the todo data holder was updated
        const updatedTodoHolder = result.find((dh) => dh.descriptor.use === "todo-list");
        expect(updatedTodoHolder).toBeDefined();
        expect((updatedTodoHolder?.data as TodoList).todos).toEqual(["Learn A12", "Write tests", "Create tutorial"]);

        // Find and verify the non-todo data holder remained unchanged
        const unchangedUserHolder = result.find((dh) => dh.descriptor.use === "user-profile");
        expect(unchangedUserHolder).toBe(nonTodoDataHolder); // Same object reference

        // Test 4: Verify immutability
        expect((mockDataHolder.data as TodoList).todos).toEqual(["Learn A12", "Write tests"]);

        // Test 5: Verify action type filtering (returns same reference for unrelated actions)
        const unrelatedAction = {
            type: "UNRELATED_ACTION",
            payload: { activityId: "test-activity" }
        } as ActivityActions.DataReducerAction;
        const originalDataHolders = [mockDataHolder];
        const unchangedResult = AddTodoDataReducer.reduce(originalDataHolders, unrelatedAction);
        expect(unchangedResult).toBe(originalDataHolders); // Same reference returned
    });
});
