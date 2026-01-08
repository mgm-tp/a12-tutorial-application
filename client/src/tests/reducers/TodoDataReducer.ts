import { Activity, ActivityActions, ActivityReducers } from "@com.mgmtp.a12.client/client-core/lib/core/activity";

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

/** Helper function to assert the type of a DataHolder */
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
