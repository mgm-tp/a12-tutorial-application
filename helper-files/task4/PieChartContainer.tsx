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

import type { ReactElement } from "react";
import { useSelector } from "react-redux";

import type { View } from "@com.mgmtp.a12.client/client-core";
import { ActionContentbox, ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core";

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
