import { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity";
import { DataLoader } from "@com.mgmtp.a12.client/client-core/lib/core/data";
import { Aggregation } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/query";
import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch";
import { RestRequestPayload } from "@com.mgmtp.a12.utils/utils-connector";

import { PieChartData } from "../types/PieChartData";

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
                fill: colors[index]
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
