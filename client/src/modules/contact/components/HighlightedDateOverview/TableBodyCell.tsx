import type { ReactElement, PropsWithChildren } from "react";

import { DocumentServiceFactory, type GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import {
    DefaultComponentMap,
    OverviewModel,
    type TableBodyCell,
    useOverviewEngineContext
} from "@com.mgmtp.a12.overviewengine/overviewengine-core";

import { isBirthdayTodayOrNextWeek } from "../../utils/dateUtils";

import HighlightedDateCell from "./HighlightedDateCell";

const documentService = new DocumentServiceFactory().getDocumentService();

export default function TableBodyCell(props: PropsWithChildren<TableBodyCell.Props>): ReactElement {
    const documentModel = useOverviewEngineContext((context) => context.documentModel);
    const documentSearchService = new DocumentServiceFactory().getDocumentModelSearchService(documentModel);
    const { columnModel, row } = props;

    if (!OverviewModel.ReferenceColumn.isAssignableFrom(columnModel)) {
        throw new Error("Column not a reference Column");
    }

    const modelPath = documentSearchService.getPathById(columnModel.elementRef);
    if (!modelPath) {
        throw new Error(`Cannot find model path with id ${columnModel.elementRef}!`);
    }

    const field = documentSearchService.getByPath(modelPath);
    // There is no field
    if (!field) {
        throw new Error(`Cannot find field with id ${columnModel.elementRef}!`);
    }

    // Get the value assigned to this field e.g. the one seen in the overview
    const value = documentService.getAssignedObject(
        row as GroupInstance,
        modelPath.map((x) => ({ ...x, index: 1 }))
    );

    // If there is a value and this is a date field
    if (value && field.type === "Field" && field.fieldType.type === "DateType") {
        const { isBirthdayToday, isBirthdayNextWeek } = isBirthdayTodayOrNextWeek(value as Date);

        if (isBirthdayToday) {
            return <HighlightedDateCell {...props} textColor="red" />;
        } else if (isBirthdayNextWeek) {
            return <HighlightedDateCell {...props} textColor="orange" />;
        }
    }

    return <DefaultComponentMap.TableBodyCell {...props} />;
}
