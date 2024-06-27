import type { ReactElement, PropsWithChildren } from "react";

import { DefaultComponentMap, type TableBodyCell } from "@com.mgmtp.a12.overviewengine/overviewengine-core";

interface HighlightedDateCellProps extends PropsWithChildren<TableBodyCell.Props> {
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
