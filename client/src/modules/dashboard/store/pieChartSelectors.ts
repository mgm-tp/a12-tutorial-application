import type { DefaultRootState } from "react-redux";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core";

import { isPieChartData, type PieChartData } from "../types/PieChartData";

export function chartDataSelector(activityId: string, dataSet: keyof PieChartData) {
    return (state: DefaultRootState) => {
        const busy = ActivitySelectors.busy(activityId)(state);
        const data = ActivitySelectors.data(activityId)(state);
        return !busy && isPieChartData(data) ? data[dataSet] : undefined;
    };
}
