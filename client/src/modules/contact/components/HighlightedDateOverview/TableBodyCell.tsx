import { addDays, endOfMonth, getYear, isToday, isValid, isWithinInterval, setYear, startOfTomorrow } from "date-fns";
import React, { ReactElement } from "react";

import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { TableBodyCell } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/components/table/sub-components/table-body-cell";
import { useOverviewEngineContext } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/context/overview-engine-context";
import { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api";
import { DefaultComponentMap } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/configuration/component-map";
import { ReferenceColumn } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/overview-model";

import HighlightedDateCell from "./HighlightedDateCell";

const documentService = new DocumentServiceFactory().getDocumentService();

function isBirthdayTodayOrNextWeek(birthday: Date): {
    isBirthdayToday: boolean;
    isBirthdayNextWeek: boolean;
} {
    const today = new Date();
    let birthdayCurrentYear = setYear(birthday, getYear(today));
    // Handle leap year
    if (!isValid(birthdayCurrentYear)) {
        // Move the date to the end of February
        birthdayCurrentYear = endOfMonth(new Date(getYear(today), 1));
    }

    // DoB is today
    const isBirthdayToday = isToday(birthdayCurrentYear);
    // DoB is greater than today but less than today plus one week
    const isBirthdayNextWeek = isWithinInterval(birthdayCurrentYear, {
        start: startOfTomorrow(),
        end: addDays(today, 7)
    });

    return { isBirthdayToday, isBirthdayNextWeek };
}

export default function TableBodyCell(props: React.PropsWithChildren<TableBodyCell.Props>): ReactElement {
    const documentModel = useOverviewEngineContext((context) => context.documentModel);
    const documentSearchService = new DocumentServiceFactory().getDocumentModelSearchService(documentModel);
    const { columnModel, row } = props;

    if (!ReferenceColumn.isAssignableFrom(columnModel)) {
        throw new Error("Column not a reference Column");
    }

    const modelPath = documentSearchService.getPathById(columnModel.elementRef);
    if (!modelPath) {
        throw new Error(`Cannot find model path with id ${columnModel.elementRef}!`);
    }

    const column = documentSearchService.getByPath(modelPath);
    // There is no column
    if (!column) {
        throw new Error(`Cannot find field with id ${columnModel.elementRef}!`);
    }

    // Get the value assigned to this column e.g. the one seen in the overview
    const value = documentService.getAssignedObject(
        row as GroupInstance,
        modelPath.map((x) => ({ ...x, index: 1 }))
    );

    // If there is a value and this is a date column
    if (value && column.type === "Field" && column.fieldType.type === "DateType") {
        const { isBirthdayToday, isBirthdayNextWeek } = isBirthdayTodayOrNextWeek(value as Date);

        if (isBirthdayToday) {
            return <HighlightedDateCell {...props} textColor="red" />;
        } else if (isBirthdayNextWeek) {
            return <HighlightedDateCell {...props} textColor="orange" />;
        }
    }

    return <DefaultComponentMap.TableBodyCell {...props} />;
}
