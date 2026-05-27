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

import { expect, type Page } from "../fixtures";
import type { TestData } from "../types";

import { FormPage } from "./FormPage";

export class ComposeFormPage extends FormPage {
    protected readonly relationForm: Locator;

    constructor(
        protected readonly page: Page,
        protected readonly formLocator: Locator = page.getByRole("form").first(),
        protected readonly relationFormLocator: Locator = page.getByRole("form").nth(1)
    ) {
        super(page, formLocator);
        this.relationForm = relationFormLocator;
    }

    async createDocument(data: TestData[], relationData: TestData[] = []): Promise<void> {
        for (const field of data) {
            await this.inputFieldValue(field);
        }

        if (relationData.length === 0) {
            await this.saveForm();
            return;
        }

        await this.form.getByRole("button").filter({ hasText: "Add" }).last().click();
        await expect(this.page.getByRole("form")).toHaveCount(2);
        const relationForm = new FormPage(this.page, this.relationForm);

        for (const field of relationData) {
            await relationForm.inputFieldValue(field);
        }

        await relationForm.saveForm();
        await this.saveForm();
    }
}
