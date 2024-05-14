import React from "react";

import { FrameFactories } from "@com.mgmtp.a12.client/client-core/lib/core/frame";
import { ApplicationModel } from "@com.mgmtp.a12.client/client-core/lib/core/model";

import { createViewProvider } from "../viewProvider";
import { customLayoutProvider } from "../layoutProvider";

export const AuthenticatedPage = (): JSX.Element => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const rootRegionRef: ApplicationModel.Region.Reference = [];
    const RegionUi = React.useMemo(() => FrameFactories.regionUiProvider(rootRegionRef), [rootRegionRef]);
    const viewProvider = React.useMemo(() => createViewProvider(), []);
    const progressComponentProvider = React.useMemo(() => FrameFactories.createProgressComponentProvider(), []);

    return (
        <RegionUi
            key="region"
            regionReference={rootRegionRef}
            layoutProvider={customLayoutProvider}
            regionUiProvider={FrameFactories.regionUiProvider}
            viewProvider={viewProvider}
            progressComponentProvider={progressComponentProvider}
        />
    );
};
