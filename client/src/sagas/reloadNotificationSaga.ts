import { put, type SagaGenerator, takeLatest } from "typed-redux-saga";

import { ActivityActions, ActivitySelectors, NotificationActions, StoreSagas } from "@com.mgmtp.a12.client/client-core";

import { RESOURCE_KEYS } from "../localization";

export const ReloadNotificationSaga = function* reloadNotificationSaga(): SagaGenerator<void> {
    yield* takeLatest(ActivityActions.reloadData, function* (action) {
        const loadingStateSelector = ActivitySelectors.loadingStateById(action.payload.activityId);

        const state = yield* StoreSagas.waitFor((state) => {
            switch (loadingStateSelector(state)) {
                case "loaded":
                    return "success";
                case "error":
                    return "error";
                default:
                    return undefined;
            }
        });

        yield* put(
            NotificationActions.add({
                activityId: action.payload.activityId,
                title: { key: RESOURCE_KEYS.notification.reload[state].title },
                message: { key: RESOURCE_KEYS.notification.reload[state].message },
                severity: state
            })
        );
    });
};
