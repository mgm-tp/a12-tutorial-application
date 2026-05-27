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

import { DataType, type FieldTestData, type FileTestData, type TestData } from "../types";
import { TestID } from "../types/testIds";
import { API_PATH, waitForApiReponse } from "../utils/api";
import { type Page, expect } from "../fixtures";
import { getByLabelWithOptionalAsterisk } from "../utils/locators";

import { BasePage } from "./BasePage";

export class FormPage extends BasePage {
    protected readonly form: Locator;
    constructor(
        protected readonly page: Page,
        protected readonly formLocator: Locator = page.getByRole("form")
    ) {
        super(page);
        this.form = formLocator;
    }

    async toBeVisible() {
        await expect(this.form).toBeVisible();
        await this.finishedLoading();
    }

    async toBeHidden() {
        await expect(this.form).toBeHidden();
    }

    async assertFieldValue(testData: TestData, locator: Locator = this.form) {
        if (testData.type === DataType.File) {
            throw new Error(`Data type File not implemented`);
        }
        const { label, value, type } = testData;
        const input = getByLabelWithOptionalAsterisk(locator, label, type);
        switch (type) {
            case DataType.Select:
            case DataType.String:
                await expect(input).toHaveValue(value);
                break;
            case DataType.Check:
                if (value === "true") {
                    await expect(input).toBeChecked();
                } else {
                    await expect(input).not.toBeChecked();
                }
                break;
            default:
                break;
        }
    }

    async assertFormValues(testData: TestData[]) {
        for (const field of testData) {
            await this.assertFieldValue(field);
        }
    }

    async inputFieldValue(testData: TestData, locator: Locator = this.form) {
        if (testData.type === DataType.File) {
            await this.uploadFileField(testData);
            return;
        }
        const { label, value, type } = testData;
        const input = getByLabelWithOptionalAsterisk(locator, label, type);
        let isChecked: boolean;

        switch (type) {
            case DataType.String:
                await input.fill(value);
                break;
            case DataType.Select:
                await input.selectOption(value);
                break;
            case DataType.Check:
                isChecked = await input.isChecked();
                if (value === "true") {
                    if (!isChecked) {
                        await input.check();
                    }
                } else if (isChecked) {
                    await input.uncheck();
                }
                break;

            default:
                throw new Error(`Data type ${type} not implemented`);
        }
    }

    async inputFieldValues(testData: TestData[], locator: Locator = this.form) {
        for (const field of testData) {
            await this.inputFieldValue(field, locator);
        }
    }

    async assertInlineRepeatFieldValues(
        sectionHeadlineLabel: string,
        testData: FieldTestData[][],
        locator: Locator = this.form
    ) {
        const section = locator.getByTestId(TestID.TYPOGRAPHY_SECTION).filter({ hasText: sectionHeadlineLabel });
        const rows = section.getByTestId(TestID.TABLE_BODY_ROW);
        await expect(rows).toHaveCount(testData.length);

        for (let i = 0; i < testData.length; i++) {
            for (const field of testData[i]) {
                await this.assertFieldValue(field, rows.nth(i));
            }
        }
    }

    async inputInlineRepeatFieldValues(
        sectionHeadlineLabel: string,
        testData: FieldTestData[][],
        locator: Locator = this.form
    ) {
        const section = locator.getByTestId(TestID.TYPOGRAPHY_SECTION).filter({ hasText: sectionHeadlineLabel });

        for (const rowData of testData) {
            await section.getByRole("button", { name: "Add" }).click();
            const row = section.getByTestId(TestID.TABLE_BODY_ROW).last();

            for (const field of rowData) {
                await this.inputFieldValue(field, row);
            }
        }
    }

    async saveForm(shouldCloseForm = true) {
        await this.form.getByRole("button", { name: "Save", disabled: false }).click();
        await this.finishedLoading();
        if (shouldCloseForm) {
            await this.toBeHidden();
        }
    }

    async createDocument(data: TestData[]) {
        await this.inputFieldValues(data);
        await this.saveForm();
    }

    async clearFieldValue(field: TestData) {
        if (field.type === DataType.File) {
            throw new Error(`Data type File not implemented`);
        }
        await getByLabelWithOptionalAsterisk(this.form, field.label, field.type).clear();
    }

    async updateDocument(fieldValues: TestData[]) {
        for (const field of fieldValues) {
            await this.clearFieldValue(field);
            await this.inputFieldValue(field);
        }

        await this.saveForm();
    }

    async uploadFileField(testData: FileTestData) {
        const { locator: fieldControlLocator, filePath } = testData;
        await this.form
            .locator(`${fieldControlLocator} [data-role=${TestID.FILE_UPLOAD_INPUT}]`)
            .setInputFiles(filePath);
        await waitForApiReponse({
            page: this.page,
            apiPath: API_PATH.ATTACHMENT,
            expectedStatusCode: 200
        });
        await expect(
            this.form.locator(`${fieldControlLocator} [data-role=${TestID.FILE_UPLOAD_CONTENT_INNER}] img`)
        ).toBeVisible();
    }
}
