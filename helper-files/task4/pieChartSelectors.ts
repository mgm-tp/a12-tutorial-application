import { DefaultRootState } from "react-redux";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity";

import { isPieChartData, PieChartData } from "../types/PieChartData";

export function chartDataSelector(activityId: string, dataSet: keyof PieChartData) {
    return (state: DefaultRootState) => {
        const busy = ActivitySelectors.busy(activityId)(state);
        const data = ActivitySelectors.data(activityId)(state);
        return !busy && isPieChartData(data) ? data[dataSet] : undefined;
    };
}
