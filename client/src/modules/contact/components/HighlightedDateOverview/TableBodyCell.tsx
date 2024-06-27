/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

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
