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

import type { Activity, DataLoader } from "@com.mgmtp.a12.client/client-core";
import { Aggregation, Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { RestRequestPayload } from "@com.mgmtp.a12.utils/utils-connector";

import type { PieChartData } from "../types/PieChartData";

const colors = ["#00589F", "#0081BD", "#00A8BD", "#00CAA3", "#8AE682", "#F9F871"];

export class PieChartDataLoader implements DataLoader<PieChartData> {
    readonly name: string = "PieChartDataLoader";

    canHandle(activityDescriptor: Activity.Descriptor): boolean {
        return activityDescriptor.module === "Dashboard";
    }

    async load(): Promise<PieChartData> {
        const contactsByType: Aggregation.AggregationTuple[] = await getContactsByType();
        return {
            contactsByType: contactsByType.map(([name, value], index) => ({
                name: `customerType.${name}`,
                value: value,
                fill: colors[index % colors.length]!
            }))
        };
    }

    save(): Promise<PieChartData> {
        throw new Error("Method not implemented.");
    }

    delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

async function getContactsByType(): Promise<Aggregation.AggregationTuple[]> {
    // Define query root for aggregation request
    const queryRoot = {
        // The document model we are interested in
        targetDocumentModel: "Contact_DM",
        // We want to group our contacts by type
        aggregation: {
            aggregations: [
                {
                    function: "count",
                    field: "/Contact/PersonalData/CustomerType"
                }
            ],
            group: [
                {
                    field: "/Contact/PersonalData/CustomerType",
                    alias: "customerType"
                }
            ]
        }
    };

    // Create Aggregation REST Request Payload
    const request: RestRequestPayload = {
        method: "POST",
        relativeUrl: `/aggregation`,
        body: JSON.stringify(queryRoot),
        customHeaders: [
            ["Accept", "application/json"],
            ["Accept-Language", "en"],
            ["Content-Type", "application/json;charset=utf8"]
        ]
    };

    // Request the data via DS request dispatcher then return it or throw
    return await Dispatcher.rest(
        request,
        // Guard to check if we get the required response
        Aggregation.Response.isInstance
    );
}
