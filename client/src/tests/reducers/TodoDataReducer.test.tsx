import { describe, it, expect } from "vitest";

import { Activity, ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity";

import { addTodo, TodoList, AddTodoDataReducer } from "./TodoDataReducer";

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
