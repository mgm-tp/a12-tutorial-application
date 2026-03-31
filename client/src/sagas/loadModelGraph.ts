import { type SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "typed-redux-saga";

import { ModelGraph } from "@com.mgmtp.a12.dataservices/dataservices-access";
import { ModelActions, ModelSelectors } from "@com.mgmtp.a12.client/client-core";
import { ConnectorLocator, RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector";
import { UaaActions } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

/**
 * Custom saga for loading the model graph.
 * This saga listens for {@link UaaActions.modifiedOidcUser} actions and triggers the {@link LoadModelGraphWorker}.
 *
 * @returns An iterator for handling saga effects.
 */
export function* LoadModelGraphSaga(): SagaIterator {
    yield* takeLatest(UaaActions.loggedIn, LoadModelGraphWorker);
}

/**
 * Worker function for loading the model graph.
 * This function fetches the model graph data from the server and dispatches it to the store.
 *
 * @returns An iterator for handling saga effects.
 */
function* LoadModelGraphWorker(): SagaIterator {
    const serverConnector = ConnectorLocator.getInstance().getServerConnector();
    if (!(serverConnector instanceof RestServerConnector)) {
        throw new TypeError("Expected RestServerConnector");
    }
    const modelGraphState = yield* select(ModelSelectors.modelGraph());

    if (!hasDocumentsInModelGraphState(modelGraphState)) {
        const modelGraph = yield* call(() =>
            serverConnector.fetchData(ModelGraph.build()).then((response) => response.json())
        );
        yield* put(ModelActions.setModelGraph(modelGraph));
    }
}

function hasDocumentsInModelGraphState(modelGraphState: ModelGraph): boolean {
    return modelGraphState.documentModels.length !== 0;
}
