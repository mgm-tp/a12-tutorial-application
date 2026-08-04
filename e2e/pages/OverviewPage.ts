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

import type { Locator } from "@playwright/test";

import { TestID } from "../types/testIds";
import type { TestData } from "../types";
import { type Page, expect } from "../fixtures";
import { API_PATH, waitForApiReponse } from "../utils/api";

import { BasePage } from "./BasePage";
import { FormPage } from "./FormPage";
import { ComposeFormPage } from "./ComposeFormPage";

export class OverviewPage extends BasePage {
    private readonly table: Locator;

    constructor(protected readonly page: Page) {
        super(page);
        this.table = page.getByTestId(TestID.TABLE);
    }
    async assertDocumentsInTable(documents: string[]) {
        for (const doc of documents) {
            await expect(this.table.getByTestId(TestID.TABLE_BODY_ROW).filter({ hasText: doc })).toBeVisible();
        }
    }

    async assertThumbnailInTable(thumbnailFileName: string, locator: Locator = this.table) {
        await expect(locator.getByRole("img", { name: thumbnailFileName })).toBeVisible();
    }

    async addDocument(document: TestData[], formLocator?: Locator) {
        await this.page.getByRole("button", { name: "Add" }).click();
        const formPage = new FormPage(this.page, formLocator);
        await formPage.finishedLoading();
        await formPage.toBeVisible();
        await formPage.createDocument(document);
        await this.assertDocumentsInTable([document[0].value]);
    }

    async addComposeDocument(
        document: TestData[],
        relationData: TestData[] = [],
        formLocator?: Locator,
        relationFormLocator?: Locator
    ) {
        await this.page.getByRole("button", { name: "Add" }).click();
        const composeFormPage = new ComposeFormPage(this.page, formLocator, relationFormLocator);
        await composeFormPage.toBeVisible();
        await composeFormPage.createDocument(document, relationData);
        await this.assertDocumentsInTable([document[0].value]);
    }

    getRow(document: string): Locator {
        const table = this.page.getByTestId(TestID.TABLE);
        const row = table.getByTestId(TestID.TABLE_BODY_ROW).filter({ hasText: document });
        return row;
    }

    async deleteRow(row: Locator, hasConfirmation: boolean = true) {
        await expect(row).toBeVisible();
        await row.getByRole("button").filter({ hasText: "delete" }).click();
        if (hasConfirmation) {
            await this.page.getByRole("button", { name: "Delete" }).click();
        }
        await waitForApiReponse({
            page: this.page,
            apiPath: API_PATH.RPC,
            expectedStatusCode: 200
        });
        await waitForApiReponse({
            page: this.page,
            apiPath: API_PATH.RPC,
            expectedStatusCode: 200
        });
    }

    async deleteAllRows(hasConfirmation: boolean = true) {
        let rowCount = await this.page.getByTestId(TestID.TABLE_BODY_ROW).count();

        while (rowCount > 0) {
            const firstRow = this.page.getByTestId(TestID.TABLE_BODY_ROW).first();
            await this.deleteRow(firstRow, hasConfirmation);
            await this.finishedLoading();
            rowCount = await this.page.getByTestId(TestID.TABLE_BODY_ROW).count();
        }

        await expect(this.page.getByTestId(TestID.TABLE_BODY_ROW)).toHaveCount(0);
        await expect(this.page.getByTestId(TestID.MESSAGE)).toHaveText("No results found");
    }

    async deleteDocument(document: string, hasConfirmation: boolean = true): Promise<void> {
        const row = this.getRow(document);
        await this.deleteRow(row, hasConfirmation);
    }

    async exportDocumentsToCSV(expectedFileName: string): Promise<void> {
        const downloadedFilePromise = this.page.waitForEvent("download");
        await this.page.getByRole("button", { name: "Export" }).click();
        await this.page.getByRole("button", { name: "OK" }).click();
        await waitForApiReponse({
            page: this.page,
            apiPath: API_PATH.RPC,
            expectedStatusCode: 200
        });
        const downloadFile = await downloadedFilePromise;
        expect(downloadFile.suggestedFilename()).toBe(expectedFileName);
    }
}
