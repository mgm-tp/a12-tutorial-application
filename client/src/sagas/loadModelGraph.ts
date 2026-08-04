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

import { call, put, select, takeLatest, type SagaGenerator } from "typed-redux-saga";

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
export function* LoadModelGraphSaga(): SagaGenerator<void> {
    yield* takeLatest(UaaActions.loggedIn, LoadModelGraphWorker);
}

/**
 * Worker function for loading the model graph.
 * This function fetches the model graph data from the server and dispatches it to the store.
 *
 * @returns An iterator for handling saga effects.
 */
function* LoadModelGraphWorker(): SagaGenerator<void> {
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
