import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import Footer from "../../components/Footer";

import { renderWithProviders } from "../utils";

describe("Footer", () => {
    it("renders the footer with links", () => {
        renderWithProviders(<Footer />);

        expect(screen.getByText("Help")).toBeInTheDocument();
        expect(screen.getByText("FAQ")).toBeInTheDocument();
    });
});
