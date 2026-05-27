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

import { expect, type Page, test } from "@playwright/test";

import { type TestUsername, USERNAMES } from "../../types";
import USERS from "../../fixtures/users.json" with { type: "json" };
import { TestID } from "../../types/testIds";
import { ensureAuthDirExists, writeUserSessionData } from "../../utils/files";

test("Auth setup", async ({ browser }) => {
    await ensureAuthDirExists();

    async function setupAuthForUser(username: TestUsername) {
        const context = await browser.newContext();
        const page = await context.newPage();
        const user = USERS[username];
        await page.goto("/");
        await page.fill("#username", user.username);
        await page.fill("#password", user.password);
        await page.press("#password", "Enter");

        const popupTrigger = page
            .getByTestId(TestID.APPLICATION_HEADER)
            .getByTestId(TestID.POPUP_TRIGGER_ELEMENT)
            .filter({ hasText: username })
            .first();
        await expect(popupTrigger).toBeVisible({ timeout: 30_000 });
        
        const sessionData = await extractSessionData(page);
        await writeUserSessionData(username, sessionData);
    }

    await Promise.all(USERNAMES.map((username) => setupAuthForUser(username)));
});

async function extractSessionData(page: Page): Promise<Record<string, string>> {
    return await page.evaluate(() => {
        const data: Record<string, string> = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (!key) continue;
            data[key] = sessionStorage.getItem(key) || "";
        }
        return data;
    });
}
