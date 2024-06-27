import React, { ReactElement } from "react";

import { PieChart, PieChartElements, PieChartProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/chart/pie-chart";
import { Typography } from "@com.mgmtp.a12.widgets/widgets-core/lib/typography";
import { ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core/lib/chart/bar-chart";

import { RESOURCE_KEYS, useLocalizer } from "../../../localization";

interface LabelState {
    name: string;
    value: number | null;
    entityId?: string;
}

interface CustomPieChartProps extends PieChartProps {
    label: string;
}

const useLabel = (): [LabelState, () => void, React.Dispatch<React.SetStateAction<LabelState>>] => {
    const initialLabelState: LabelState = {
        name: "",
        value: null
    };
    const [label, setLabel] = React.useState<LabelState>(initialLabelState);
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
        <ResponsiveChartContainer height={550}>
            <PieChart
                innerRadius="50%"
                outerRadius="100%"
                data={data}
                legendProps={{
                    align: "right",
                    verticalAlign: "top",
                    showNonPositiveEntries: true,
                    onMouseEnter: changeLabel,
                    onMouseLeave: resetLabel,
                    style: { zIndex: 1 }
                }}
                pieProps={{
                    onMouseOver: changeLabel,
                    onMouseOut: resetLabel
                }}
                label={[
                    <PieChartElements.Label
                        key="chart-label"
                        primaryText={
                            !labelState.name && (
                                <PieChartElements.Text position="center">{totalCount}</PieChartElements.Text>
                            )
                        }
                        secondaryText={
                            !labelState.value && (
                                <PieChartElements.Text type="secondary" position="center">
                                    {label || "Total"}
                                </PieChartElements.Text>
                            )
                        }
                    />,
                    <PieChartElements.Label
                        key="segment-label"
                        primaryText={
                            <PieChartElements.Text position="center">{labelState.value ?? ""}</PieChartElements.Text>
                        }
                        secondaryText={
                            <PieChartElements.Text type="secondary" position="center">
                                {labelState.name}
                            </PieChartElements.Text>
                        }
                    />
                ]}
            />
        </ResponsiveChartContainer>
    );
}
