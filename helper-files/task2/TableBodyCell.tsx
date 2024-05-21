import type { ReactElement, PropsWithChildren } from "react";
import { addDays, endOfMonth, getYear, isToday, isValid, isWithinInterval, setYear, startOfTomorrow } from "date-fns";

import { DocumentServiceFactory, type GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import {
    DefaultComponentMap,
    OverviewModel,
    type TableBodyCell,
    useOverviewEngineContext
} from "@com.mgmtp.a12.overviewengine/overviewengine-core";

// import HighlightedDateCell from "./HighlightedDateCell";

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
            // TODO: 1
            // return <HighlightedDateCell {...props} textColor="red" />;
        } else if (isBirthdayNextWeek) {
            // TODO: 2
            // return <HighlightedDateCell {...props} textColor="orange" />;
        }
    }

    return <DefaultComponentMap.TableBodyCell {...props} />;
}
