import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "typed-redux-saga";

import { ModelGraph } from "@com.mgmtp.a12.dataservices/dataservices-access/lib";
import { ModelActions, ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model";
import { ConnectorLocator, RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector/lib/main";
import { UaaActions } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

/**
 * Custom saga for loading the model graph.
 * This saga listens for {@link UaaActions.loggedIn} actions and triggers the {@link LoadModelGraphWorker}.
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
    const serverConnecter = ConnectorLocator.getInstance().getServerConnector() as RestServerConnector;
    const modelGraphState = yield* select(ModelSelectors.modelGraph());

    if (!hasDocumentsInModelGraphState(modelGraphState)) {
        const modelGraph = yield* call(() =>
            serverConnecter.fetchData(ModelGraph.build(true)).then((response) => response.json())
        );
        yield* put(ModelActions.setModelGraph(modelGraph));
    }
}

function hasDocumentsInModelGraphState(modelGraphState: ModelGraph): boolean {
    return modelGraphState.documentModels.length !== 0;
}
