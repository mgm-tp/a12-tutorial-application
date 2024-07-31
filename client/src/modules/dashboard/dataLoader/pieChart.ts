import {
    JsonRpc2Request,
    JsonRpc2Response,
    JsonRpc2ResponseOK,
    ListDocumentsJsonRpc2Response
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity";
import { ConnectorLocator, RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector/lib/main";
import { DataLoader } from "@com.mgmtp.a12.client/client-core/lib/core/data";

import { ChartData } from "../types";

const colors = ["#00589F", "#0081BD", "#00A8BD", "#00CAA3", "#8AE682", "#F9F871"];

export class PieChartDataLoader implements DataLoader<ChartData> {
    readonly name: string = "PieChartDataLoader";

    canHandle(activityDescriptor: Activity.Descriptor): boolean {
        return activityDescriptor.module === "Dashboard";
    }

    async load(): Promise<ChartData> {
        const contactsByType: JsonRpc2Response.Facets.BucketContent[] = await getContactsByType();
        return {
            chartData: contactsByType.map((type, index) => ({
                name: `customerType.${type.value}`,
                value: type.count,
                color: colors[index]
            }))
        };
    }

    save(): Promise<ChartData> {
        return Promise.reject(new Error("Operation not supported!"));
    }

    delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

async function getContactsByType(): Promise<JsonRpc2Response.Facets.BucketContent[]> {
    // Getting the server connector
    const serverConnector = ConnectorLocator.getInstance().getServerConnector() as RestServerConnector;
    const facetId = "contactType";

    // Building our JSON-RPC request
    const jsonRpcRequest: JsonRpc2Request = {
        id: "getContactsByType",
        jsonrpc: "2.0",
        method: "LIST_DOCUMENTS",
        params: {
            // The document model we are interested in
            documentModelName: "Contact_DM",
            // We want to group our contacts by type
            facets: [
                {
                    id: facetId,
                    type: "term",
                    field: "Contact.PersonalData.CustomerType"
                }
            ]
        }
    };

    // A utility from A12 to add some extra properties
    const request = JsonRpc2Request.build([jsonRpcRequest]);

    // Sending our request
    const response = await serverConnector.fetchData(request);

    // Did it fail?
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    // Get the data
    const [data]: JsonRpc2ResponseOK[] = await response.json();

    // Make typescript happy by confirming the result is of the expected type
    if (data && ListDocumentsJsonRpc2Response.isInstance(data)) {
        if (data.result.facets && facetId in data.result.facets) {
            const facetResult = data.result.facets[facetId] as JsonRpc2Response.Facets.BucketedFacetResult;
            return facetResult.buckets;
        }
    }

    // Something must have gone really wrong to end up here
    return [];
}
