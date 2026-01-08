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
