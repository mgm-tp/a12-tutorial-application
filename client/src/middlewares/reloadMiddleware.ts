import { ActivityActions, StoreFactories } from "@com.mgmtp.a12.client/client-core";
import { Events, OverviewEngineActions } from "@com.mgmtp.a12.overviewengine/overviewengine-core";

export const ReloadMiddleware = StoreFactories.createMiddleware((api, next, action) => {
    const result = next(action);

    if (
        OverviewEngineActions.event.match(action) &&
        Events.onEventButtonClicked.match(action.payload.engineAction) &&
        action.payload.engineAction.payload.event === "reload"
    ) {
        api.dispatch(ActivityActions.reloadData({ activityId: action.payload.activityId }));
    }

    return result;
});
