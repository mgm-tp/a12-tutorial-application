import { ReactElement } from "react";
import { useSelector } from "react-redux";

import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import { ActionContentbox, ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox";

import { RESOURCE_KEYS, useLocalizer } from "../../../localization";

import { chartDataSelector } from "../store/pieChartSelectors";

import CustomPieChart from "./PieChart";

export default function PieChartContainer({ activityId }: View): ReactElement | null {
    const chartDataList = useSelector(chartDataSelector(activityId, "contactsByType"));
    const localizer = useLocalizer();

    if (!chartDataList) {
        return null;
    }

    const getLabel = (resourceKey: string) => {
        const localizedValue = localizer(resourceKey);
        return localizedValue || resourceKey;
    };

    // Some values don't need localization e.g. names of contacts
    // If value is found in resources return it else return the name passed in
    const localizedChartData = chartDataList.map((d) => ({ ...d, name: getLabel(d.name) }));

    return (
        <ActionContentbox
            className="-u-max-width-2xl -u-height-full"
            headingElements={
                <ContentBoxElements.Title ariaLevel={2} key="title" text={localizer(RESOURCE_KEYS.dashboard.title)} />
            }>
            <div className="-u-flex -u-items-center -u-justify-center -u-height-full">
                <CustomPieChart label={localizer(RESOURCE_KEYS.dashboard.chart)} data={localizedChartData} />
            </div>
        </ActionContentbox>
    );
}
