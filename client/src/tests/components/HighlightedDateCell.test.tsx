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

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import type { TableBodyCell } from "@com.mgmtp.a12.overviewengine/overviewengine-core";

import HighlightedDateCell from "../../modules/contact/components/HighlightedDateOverview/HighlightedDateCell";

import { renderWithProviders } from "../utils";

describe("HighlightedDateCell", () => {
    //Mock Column Data
    const mockColumnModel = {
        id: "dateOfBirth",
        elementRef: "PersonalData.DateOfBirth",
        width: 150,
        visible: true,
        sortable: true,
        editable: false
    };

    //Mock Row data
    const mockRow = {
        id: "test-row-1",
        modelId: "Contact_Dc",
        data: {
            dateOfBirth: new Date("1990-01-15")
        }
    };

    const mockProps: Pick<TableBodyCell.Props, "columnModel" | "row"> = {
        columnModel: mockColumnModel,
        row: mockRow
    };

    it("renders if birthday is today", () => {
        renderWithProviders(
            <HighlightedDateCell {...mockProps} textColor="red">
                Birthday Today
            </HighlightedDateCell>
        );

        const container = screen.getByText("Birthday Today").parentElement;
        expect(container).toHaveClass("-u-text-red");
        expect(container).toHaveClass("-u-font-semibold");
    });

    it("renders if birthday is next week", () => {
        renderWithProviders(
            <HighlightedDateCell {...mockProps} textColor="orange">
                Birthday Next Week
            </HighlightedDateCell>
        );

        const container = screen.getByText("Birthday Next Week").parentElement;
        expect(container).toHaveClass("-u-text-orange");
        expect(container).toHaveClass("-u-font-semibold");
    });
});
