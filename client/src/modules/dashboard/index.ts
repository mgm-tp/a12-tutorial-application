import type { Module, View } from "@com.mgmtp.a12.client/client-core";

import PieChartContainer from "./components/PieChartContainer";

const VIEWS: { [name: string]: View.ViewComponent } = {
    PieChartContainer
};

function viewComponentProvider(name: string) {
    return VIEWS[name];
}
const module: Module = {
    id: "DashboardModule",
    views: () => viewComponentProvider
};

export default module;
