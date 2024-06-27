import { type ReactElement, useState, useContext, useMemo, type Dispatch, type SetStateAction } from "react";

import type { View } from "@com.mgmtp.a12.client/client-core";
import { CRUDViews } from "@com.mgmtp.a12.crud/crud-core";
import { type ComponentMap, DefaultComponentMap } from "@com.mgmtp.a12.overviewengine/overviewengine-core";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core";

import Heading from "./Heading";
import TableBodyCell from "./TableBodyCell";

export default function HighlightedDateOverview(props: View): ReactElement {
    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
    const { currentSize } = useContext(SizeContext);
    const isSmallScreenSize = currentSize === "xs" || currentSize === "sm";

    const componentMap: ComponentMap = useMemo(
        () => createComponentMap(isHighlighted, setIsHighlighted),
        [isHighlighted, setIsHighlighted]
    );

    return <CRUDViews.OverviewEngineView {...props} componentMap={componentMap} cardView={isSmallScreenSize} />;
}

function createComponentMap(isHighlighted: boolean, setIsHighlighted: Dispatch<SetStateAction<boolean>>): ComponentMap {
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
