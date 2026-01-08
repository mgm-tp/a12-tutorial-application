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

import type { Activity, ActivityActions, ActivityReducers } from "@com.mgmtp.a12.client/client-core";

/** Action type constant */
const ADD_TODO = "Tutorial/ADD_TODO";

/** The payload of the addTodo action. */
export interface AddTodoPayload extends ActivityActions.ActivityActionPayload {
    readonly todo: string;
}

/** Action interface */
interface AddTodoAction {
    type: typeof ADD_TODO;
    payload: AddTodoPayload;
}

/** Todo list data structure to manage in a DataHolder */
export interface TodoList {
    readonly todos: string[];
}

/** Action creator to add a new Todo item */
export const addTodo = (payload: AddTodoPayload): AddTodoAction => ({
    type: ADD_TODO,
    payload
});

/** Helper function to check if action is addTodo */
function isAddTodoAction(action: unknown): action is AddTodoAction {
    return (action as AddTodoAction).type === ADD_TODO;
}

/** Helper function to assert the type of DataHolder */
export function isTodoDataHolder(dh: Activity.DataHolder): dh is Activity.DataHolder<TodoList> {
    return dh.descriptor.use === "todo-list";
}

export const AddTodoDataReducer: ActivityReducers.DataReducer = {
    reduce(dataHolders, action) {
        return isAddTodoAction(action)
            ? dataHolders.map((dh: Activity.DataHolder) => {
                  return isTodoDataHolder(dh)
                      ? {
                            ...dh,
                            data: {
                                ...dh.data,
                                todos: [...(dh.data?.todos ?? []), action.payload.todo]
                            }
                        }
                      : dh;
              })
            : dataHolders;
    }
};
