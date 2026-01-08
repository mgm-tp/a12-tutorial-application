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
