export type PieChartDataSegment = {
    name: string;
    value: number;
    fill: string;
};

export type PieChartData = { contactsByType: PieChartDataSegment[] };

export function isPieChartData(argument: unknown): argument is PieChartData {
    return !!(
        argument &&
        typeof argument === "object" &&
        "contactsByType" in argument &&
        isChartDataSet(argument.contactsByType)
    );
}

export function isChartDataSet(argument: unknown): argument is PieChartDataSegment[] {
    // fast resolve if data found is of type ChartData - if necessary change some to every
    return Array.isArray(argument) && (argument.length === 0 || argument.some((arg) => isChartData(arg)));
}

export function isChartData(argument: unknown): argument is PieChartDataSegment {
    return !!(
        argument &&
        typeof argument === "object" &&
        "name" in argument &&
        "fill" in argument &&
        "value" in argument &&
        typeof argument.value === "number"
    );
}
