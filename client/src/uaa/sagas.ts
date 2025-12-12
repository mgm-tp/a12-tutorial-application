import { SagaIterator } from "redux-saga";
import { put, select, takeLatest } from "typed-redux-saga";

import { isUaaOidcUser, UaaActions, UaaSelectors } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

export function* setRolesForUserAfterTokenRefresh(): SagaIterator {
    yield* takeLatest(UaaActions.oidc_user_expiring, handle);

    function* handle(): SagaIterator {
        const user = yield* select(UaaSelectors.user);
        if (isUaaOidcUser(user)) {
            yield* put(UaaActions.modifyingOidcUser(user));
        }
    }
}
