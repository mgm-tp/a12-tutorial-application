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

import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Heading from "../../modules/contact/components/HighlightedDateOverview/Heading";

import { renderWithProviders } from "../utils";

describe("Heading", () => {
    const mockSetIsHighlighted = vi.fn();

    const mockHeadingProps: React.ComponentProps<typeof Heading> = {
        title: "Contact Overview",
        subtitle: "Manage your contacts",
        buttons: [],
        isHighlighted: false,
        setIsHighlighted: mockSetIsHighlighted
    };

    it("renders heading with toggle button", () => {
        renderWithProviders(<Heading {...mockHeadingProps} />);

        // Verify that the custom button is present
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("button--primary");
    });

    it("renders icon when button is toggled", () => {
        renderWithProviders(<Heading {...mockHeadingProps} isHighlighted={true} />);

        // Verify highlight_off icon text is present
        const highlightOffIcon = screen.getByText("highlight_off");
        expect(highlightOffIcon).toBeInTheDocument();
    });

    it("renders button with correct styling", () => {
        renderWithProviders(<Heading {...mockHeadingProps} />);

        // Find the button container div
        const buttonContainer = screen.getByRole("button").parentElement;

        // Verify correct styling classes are applied
        expect(buttonContainer).toHaveClass("-u-flex");
        expect(buttonContainer).toHaveClass("-u-items-center");
        expect(buttonContainer).toHaveClass("-u-justify-end");
        expect(buttonContainer).toHaveClass("-u-padding-x-xl");
        expect(buttonContainer).toHaveClass("-u-margin-y-sm");
    });

    it("should verify heading functionalities", async () => {
        const user = userEvent.setup();
        renderWithProviders(<Heading {...mockHeadingProps} />);

        // Test initial state
        expect(screen.getByText("highlight")).toBeInTheDocument();
        expect(screen.queryByText("highlight_off")).not.toBeInTheDocument();

        // Simulate user clicking the button
        const button = screen.getByRole("button");
        await user.click(button);

        // Verify the toggle function behavior
        expect(mockSetIsHighlighted).toHaveBeenCalledWith(expect.any(Function));

        // Test the actual toggle function logic
        const toggleFunction = mockSetIsHighlighted.mock.calls[0][0];
        expect(toggleFunction(false)).toBe(true);
        expect(toggleFunction(true)).toBe(false);
    });
});
