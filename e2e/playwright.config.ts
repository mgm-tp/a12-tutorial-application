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

import { defineConfig, devices } from "@playwright/test";

import { BASE_URL } from "./utils/config";

export default defineConfig({
    testDir: "./tests",
    forbidOnly: !!process.env.CI,
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 3 : undefined,
    reporter: "html",
    use: {
        headless: true,
        viewport: { width: 1200, height: 660 },
        baseURL: BASE_URL,
        testIdAttribute: "data-role",
        trace: "on-first-retry"
    },
    timeout: 60_000,
    expect: {
        timeout: 10_000
    },
    projects: [
        {
            name: "base",
            use: { ...devices["Desktop Chrome"], channel: "chromium" },
            testDir: "./tests/base",
            dependencies: ["setup-base"]
        },
        {
            name: "setup-base",
            use: { ...devices["Desktop Chrome"], channel: "chromium" },
            testDir: "./tests/base",
            testMatch: /0-clean\.setup\.ts/,
            dependencies: ["setup-auth"]
        },

        {
            name: "extended",
            use: { ...devices["Desktop Chrome"], channel: "chromium" },
            testDir: "./tests/extended",
            dependencies: ["setup-extended"]
        },
        {
            name: "setup-extended",
            use: { ...devices["Desktop Chrome"], channel: "chromium" },
            testDir: "./tests/extended",
            testMatch: /0-clean\.setup\.ts/,
            dependencies: ["setup-auth"]
        },

        { name: "setup-auth", testMatch: /auth\.setup\.ts/, teardown: "cleanup" },
        { name: "cleanup", testMatch: /auth\.teardown\.ts/ }
    ]
});
