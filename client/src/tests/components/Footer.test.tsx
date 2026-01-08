import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Footer from "../../components/Footer";

import { renderWithProviders } from "../utils";

describe("Footer", () => {
    it("renders the footer with links", () => {
        renderWithProviders(<Footer />);

        expect(screen.getByText("Help")).toBeInTheDocument();
        expect(screen.getByText("FAQ")).toBeInTheDocument();
    });

    it("should verify footer functionalities", async () => {
        const user = userEvent.setup();
        const { mockDispatch } = renderWithProviders(<Footer />);

        const helpLink = screen.getByText("Help");
        const faqLink = screen.getByText("FAQ");

        // Verify that the links are clickable elements
        expect(helpLink.tagName.toLowerCase()).toBe("a");
        expect(faqLink.tagName.toLowerCase()).toBe("a");

        // Test clicking Help link and verify Redux action is dispatched
        await user.click(helpLink);
        expect(mockDispatch).toHaveBeenCalledWith({
            type: "Application/START_MAIN_ACTIVITY_REQUESTED",
            payload: {
                descriptor: {
                    module: "Help"
                }
            }
        });

        // Test clicking FAQ link and verify Redux action is dispatched
        await user.click(faqLink);
        expect(mockDispatch).toHaveBeenCalledWith({
            type: "Application/START_MAIN_ACTIVITY_REQUESTED",
            payload: {
                descriptor: {
                    module: "Help",
                    page: "faq"
                }
            }
        });
    });
});
