import { Module } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";

import PieChartContainer from "./components/PieChartContainer";

const VIEWS: { [name: string]: React.ComponentType<View> } = {
    PieChartContainer
};

function viewComponentProvider(name: string) {
    return VIEWS[name];
}
const module = (): Module => ({
    id: "DashboardModule",
    views: () => viewComponentProvider
});

export default module;
