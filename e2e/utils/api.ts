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

import type { Page, Response } from "@playwright/test";

export enum API_PATH {
    RPC = "/v2/rpc",
    ATTACHMENT = "/v2/attachment",
    SYNC = "/v2/sync",
    REMINDERS = "/reminders"
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function apiUrlFromPage(page: Page, apiPath: string) {
    const { origin } = new URL(page.url());
    return `${origin}/api${apiPath.startsWith("/") ? "" : "/"}${apiPath}`;
}

export async function waitForApiReponse({
    page,
    apiPath,
    expectedStatusCode,
    method = "POST"
}: {
    page: Page;
    apiPath: API_PATH;
    expectedStatusCode: number;
    method?: HttpMethod;
}): Promise<Response> {
    const urlPrefix = apiUrlFromPage(page, apiPath);
    const response = await page.waitForResponse(
        (resp) =>
            resp.request().url().startsWith(urlPrefix) &&
            resp.request().method() === method &&
            resp.status() === expectedStatusCode
    );

    return response;
}
