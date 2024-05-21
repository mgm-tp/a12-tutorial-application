import React from "react";

import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import { CRUDViews } from "@com.mgmtp.a12.crud/crud-core";
import {
    ComponentMap,
    DefaultComponentMap
} from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/configuration/component-map";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core";

import Heading from "./Heading";
import TableBodyCell from "./TableBodyCell";

export default function HighlightedDateOverview(props: View): React.ReactElement {
    const [isHighlighted, setIsHighlighted] = React.useState<boolean>(false);
    const { currentSize } = React.useContext(SizeContext);
    const isSmallScreenSize = currentSize === "xs" || currentSize === "sm";

    const componentMap: ComponentMap = React.useMemo(
        () => createComponentMap(isHighlighted, setIsHighlighted),
        [isHighlighted, setIsHighlighted]
    );

    return <CRUDViews.OverviewEngineView {...props} componentMap={componentMap} cardView={isSmallScreenSize} />;
}

function createComponentMap(
    isHighlighted: boolean,
    setIsHighlighted: React.Dispatch<React.SetStateAction<boolean>>
): ComponentMap {
    return {
        ...DefaultComponentMap,
        Heading(headingProps) {
            return <Heading {...headingProps} isHighlighted={isHighlighted} setIsHighlighted={setIsHighlighted} />;
        },
        TableBodyCell(tableBodyCellProps) {
            const { columnModel } = tableBodyCellProps;
            if (columnModel.id === "column-highlight-date" && isHighlighted) {
                return <TableBodyCell {...tableBodyCellProps} />;
            }
            return <DefaultComponentMap.TableBodyCell {...tableBodyCellProps} />;
        }
    };
}
