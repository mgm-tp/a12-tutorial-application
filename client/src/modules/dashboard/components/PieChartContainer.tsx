import React, { ReactElement } from "react";
import { useSelector } from "react-redux";

import { Activity, ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity";
import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import { ActionContentbox, ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core";

import { RESOURCE_KEYS, useLocalizer } from "../../../localization";

import { ChartData } from "../types";

import CustomPieChart from "./PieChart";

export default function PieChartContainer({ activityId }: View): ReactElement | null {
    const activity = useSelector(ActivitySelectors.activityById(activityId))!;
    const dataHolder = Activity.findDefaultDataHolder(activity);
    const localizer = useLocalizer();

    if (!dataHolder?.data || dataHolder?.busy) {
        return null;
    }

    const { chartData = [] } = dataHolder.data as ChartData;

    const getLabel = (resourceKey: string) => {
        const localizedValue = localizer(resourceKey);
        return localizedValue || resourceKey;
    };

    // Some values don't need localization e.g. names of contacts
    // If value is found in resources return it else return the name passed in
    const localizedChartData = chartData.map((d) => ({ ...d, name: getLabel(d.name) }));

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
