import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { TableBodyCell } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/components/table/sub-components/table-body-cell";

import HighlightedDateCell from "../../modules/contact/components/HighlightedDateOverview/HighlightedDateCell";

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
        data: {
            dateOfBirth: new Date("1990-01-15")
        }
    };

    const mockProps: Pick<TableBodyCell.Props, "columnModel" | "row"> = {
        columnModel: mockColumnModel,
        row: mockRow
    };

    it("renders if birthday is today", () => {
        render(
            <HighlightedDateCell {...mockProps} textColor="red">
                Birthday Today
            </HighlightedDateCell>
        );

        const container = screen.getByText("Birthday Today").parentElement;
        expect(container).toHaveClass("-u-text-red");
        expect(container).toHaveClass("-u-font-semibold");
    });

    it("renders if birthday is next week", () => {
        render(
            <HighlightedDateCell {...mockProps} textColor="orange">
                Birthday Next Week
            </HighlightedDateCell>
        );

        const container = screen.getByText("Birthday Next Week").parentElement;
        expect(container).toHaveClass("-u-text-orange");
        expect(container).toHaveClass("-u-font-semibold");
    });
});
