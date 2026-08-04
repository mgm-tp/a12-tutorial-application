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

import { expect, test } from "../../fixtures";
import { USERNAMES } from "../../types";
import { TestID } from "../../types/testIds";

test.describe("Login flow", () => {
    for (const username of USERNAMES) {
        test(`should login with the ${username} user`, async ({ getPageAs }) => {
            const page = await getPageAs(username);
            await page.goto("/");

            const popupTrigger = page
                .getByTestId(TestID.APPLICATION_HEADER)
                .getByTestId(TestID.POPUP_TRIGGER_ELEMENT)
                .filter({ hasText: username })
                .first();
            await expect(popupTrigger).toBeVisible();
            await popupTrigger.click();
            await expect(page.getByTestId(TestID.POPUP_MENU)).toContainText("Logged in as");
            await expect(page.getByTestId(TestID.POPUP_MENU)).toContainText(username);
        });
    }
});
