import { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity";
import {
    ConnectorLocator,
    RestRequestPayload,
    RestServerConnector
} from "@com.mgmtp.a12.utils/utils-connector/lib/main";
import { DataLoader } from "@com.mgmtp.a12.client/client-core/lib/core/data";

import { ChartData } from "../types/chartData";

const colors = ["#00589F", "#0081BD", "#00A8BD", "#00CAA3", "#8AE682", "#F9F871"];

export class PieChartDataLoader implements DataLoader<ChartData> {
    readonly name: string = "PieChartDataLoader";

    canHandle(activityDescriptor: Activity.Descriptor): boolean {
        return activityDescriptor.module === "Dashboard";
    }

    async load(): Promise<ChartData> {
        const contactsByType: [string, number][] = await getContactsByType();
        return {
            chartData: contactsByType.map(([name, value], index) => ({
                name: `customerType.${name}`,
                value: value,
                color: colors[index]
            }))
        };
    }

    save(): Promise<ChartData> {
        throw new Error("Method not implemented.");
    }

    delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

async function getContactsByType(): Promise<[string, number][]> {
    // Getting the server connector
    const serverConnector = ConnectorLocator.getInstance().getServerConnector() as RestServerConnector;

    // Building our REST request
    const request: RestRequestPayload = {
        relativeUrl: "/aggregation",
        method: "POST",
        body: JSON.stringify({
            id: "Pie Chart Aggregation",
            // The document model we are interested in
            targetDocumentModel: "Contact_DM",
            // We want to group our contacts by type
            aggregation: {
                aggregations: [
                    {
                        function: "count",
                        field: "/Contact/PersonalData/EmailAddress"
                    }
                ],
                group: [
                    {
                        field: "/Contact/PersonalData/CustomerType"
                    }
                ]
            }
        }),
        customHeaders: [
            ["Accept-Language", "en"],
            ["Accept", "application/json"],
            ["Content-Type", "application/json;charset=utf8"]
        ]
    };

    // Sending our request
    const response = await serverConnector.fetchData(request);

    // Did it fail?
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    // Return the data
    return (await response.json()) ?? [];
}
