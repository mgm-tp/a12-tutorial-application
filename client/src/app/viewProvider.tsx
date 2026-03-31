import type { View } from "@com.mgmtp.a12.client/client-core";
import { CRUDViews } from "@com.mgmtp.a12.crud/crud-core";
import { TreeEngineFactories } from "@com.mgmtp.a12.treeengine/treeengine-core";
import { DefaultElementLibraryFactories } from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import { withFormElementContexts } from "@com.mgmtp.a12.formengine/formengine-content-elements";

type ViewMap = Record<string, View.ViewComponent | undefined>;

/**
 * View providers for Form and Overview Engine.
 *
 * Based on the view names specified in the App Model, these are mapped to React components of the respective engine.
 * These take care of rendering the content for forms and overviews.
 */
export const enginesViewMap = {
    TreeEngine(props) {
        return <TreeEngineFactories.ViewComponent {...props} />;
    },
    FormEngine(props) {
        return <CRUDViews.FormEngineView {...props} />;
    },
    OverviewEngine(props) {
        return <CRUDViews.OverviewEngineView {...props} timeMode="24h" />;
    },
    ContentEngine: withFormElementContexts({
        ViewComponent: DefaultElementLibraryFactories.ViewComponent
    })
} satisfies ViewMap;
