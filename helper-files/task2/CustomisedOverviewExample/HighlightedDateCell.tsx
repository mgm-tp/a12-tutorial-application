import React, { ReactElement } from "react";

import { TableBodyCell } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/components/table/sub-components/table-body-cell";
import { DefaultComponentMap } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/configuration/component-map";

interface HighlightedDateCellProps extends React.PropsWithChildren<TableBodyCell.Props> {
    textColor: "red" | "orange" | "green";
}

export default function HighlightedDateCell({
    textColor,
    ...tableBodyCellProps
}: HighlightedDateCellProps): ReactElement {
    return (
        <div className={`-u-text-${textColor} -u-font-semibold`}>
            <DefaultComponentMap.TableBodyCell {...tableBodyCellProps} />
        </div>
    );
}
