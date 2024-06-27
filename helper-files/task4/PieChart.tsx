import { ReactElement, useState, Dispatch, SetStateAction } from "react";
import { Label, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Typography } from "@com.mgmtp.a12.widgets/widgets-core/lib/typography";

import { RESOURCE_KEYS, useLocalizer } from "../../../localization";

import { isChartData, PieChartDataSegment } from "../types/PieChartData";

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
