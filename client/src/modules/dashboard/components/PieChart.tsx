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

import { type ReactElement, useState, type Dispatch, type SetStateAction } from "react";
import { Label, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Typography } from "@com.mgmtp.a12.widgets/widgets-core";

import { RESOURCE_KEYS, useLocalizer } from "../../../localization";

import { isChartData, type PieChartDataSegment } from "../types/PieChartData";

interface LabelState {
    name: string;
    value: number | null;
}

interface CustomPieChartProps {
    label: string;
    data: PieChartDataSegment[];
}

const useLabel = (): [LabelState, () => void, Dispatch<SetStateAction<LabelState>>] => {
    const initialLabelState: LabelState = {
        name: "",
        value: null
    };
    const [label, setLabel] = useState<LabelState>(initialLabelState);
    const resetLabel = () => setLabel(initialLabelState);

    return [label, resetLabel, setLabel];
};

export default function CustomPieChart({ data, label }: CustomPieChartProps): ReactElement | null {
    const localizer = useLocalizer();
    const [labelState, resetLabel, changeLabel] = useLabel();
    const totalCount = data.reduce((count, next) => count + next.value, 0);

    if (totalCount === 0) {
        return (
            <Typography.Headline level={2} ariaLevel={2}>
                {localizer(RESOURCE_KEYS.dashboard.noData)}
            </Typography.Headline>
        );
    }

    return (
        <ResponsiveContainer height={550}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    innerRadius="50%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive
                    onMouseOver={changeLabelByUnknownData}
                    onMouseOut={resetLabel}>
                    <Label position={"centerBottom"} fontSize={"3rem"}>
                        {labelState.value || totalCount}
                    </Label>
                    <Label
                        style={{ transform: "translateY(.5rem)" }}
                        fill="black"
                        position={"centerTop"}
                        fontSize={"2rem"}>
                        {labelState.name || label || "Total"}
                    </Label>
                </Pie>
                <Legend
                    align={"right"}
                    verticalAlign="top"
                    onMouseEnter={changeLabelByUnknownData}
                    onMouseLeave={resetLabel}
                    style={{ zIndex: 1 }}
                    layout={"vertical"}
                />
            </PieChart>
        </ResponsiveContainer>
    );

    function changeLabelByUnknownData(data: unknown) {
        const labelData = getLabelDataFromUnknownPayload(data);
        if (labelData) {
            changeLabel(labelData);
        }
    }

    function getLabelDataFromUnknownPayload(data: unknown): Pick<PieChartDataSegment, "name" | "value"> | undefined {
        return (
            (isChartData(data) && { name: data.name, value: data.value }) ||
            // we expect chart data could resist inside a payload property
            (!!data && typeof data === "object" && "payload" in data && getLabelDataFromUnknownPayload(data.payload)) ||
            undefined
        );
    }
}
