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

import { fileURLToPath } from "node:url";

import { test } from "../../fixtures";
import { DataType, type FieldTestData, type FileTestData } from "../../types";
import { TestID } from "../../types/testIds";
import { OverviewPage } from "../../pages/OverviewPage";
import { FormPage } from "../../pages/FormPage";

const companyData: FieldTestData[] = [
    { label: "Company Name", value: "Systex", type: DataType.String },
    { label: "Website", value: "https://systex.com", type: DataType.String }
];

const updateData: FieldTestData[] = [
    { label: "Company Name", value: "Quantumsafe", type: DataType.String },
    {
        label: "Website",
        value: "https://quantumsafe.com/",
        type: DataType.String
    }
];

const phoneNumberData: FieldTestData[][] = [
    [{ label: "Phone number", value: "123456789", type: DataType.String }],
    [{ label: "Phone number", value: "987654321", type: DataType.String }],
    [{ label: "Phone number", value: "123123123", type: DataType.String }]
];

const addressData: FieldTestData[][] = [
    [
        { label: "Street", value: "71 Quang Trung", type: DataType.String },
        { label: "City", value: "Da nang", type: DataType.String },
        { label: "Country", value: "Viet Nam", type: DataType.String }
    ],
    [
        { label: "Street", value: "Taunusstr. 23", type: DataType.String },
        { label: "City", value: "Munich", type: DataType.String },
        { label: "Country", value: "German", type: DataType.String }
    ],
    [
        { label: "Street", value: "Letenské náměstí 4/157", type: DataType.String },
        { label: "City", value: "Prague", type: DataType.String },
        { label: "Country", value: "Czech", type: DataType.String }
    ]
];

const profileData: FileTestData = {
    locator: `[data-role=${TestID.FILE_UPLOAD_CONTROL}]`,
    filePath: fileURLToPath(new URL("../../fixtures/image.png", import.meta.url)),
    value: "image.png",
    type: DataType.File
};

test.describe("Company Module", () => {
    test.describe.serial("Company Module - CRUD", () => {
        let overviewPage: OverviewPage;
        let formPage: FormPage;

        test.beforeEach(async ({ getPageAs }) => {
            const page = await getPageAs("admin");
            overviewPage = new OverviewPage(page);
            formPage = new FormPage(page);
            await overviewPage.gotoHome();
            await overviewPage.switchOnEnglish();
            await overviewPage.clickMenuItem("Company");
        });

        test("should create a new company", async () => {
            await overviewPage.addDocument(companyData);
        });

        test("should add logo for company", async () => {
            const row = overviewPage.getRow(companyData[0].value);
            await row.click();

            await formPage.toBeVisible();
            await formPage.uploadFileField(profileData);
            await formPage.saveForm();
            await formPage.toBeHidden();

            await overviewPage.assertThumbnailInTable(profileData.value, row);
        });

        test("should update a company", async () => {
            const row = overviewPage.getRow(companyData[0].value);
            await row.click();

            await formPage.toBeVisible();
            await formPage.updateDocument(updateData);
            await formPage.toBeHidden();

            await overviewPage.assertDocumentsInTable([updateData[0].value]);
        });

        test("should add 3 addresses", async () => {
            const sectionHeadlineLabel = "Address";

            const row = overviewPage.getRow(updateData[0].value);
            await row.click();

            await formPage.toBeVisible();
            await formPage.inputInlineRepeatFieldValues(sectionHeadlineLabel, addressData);
            await formPage.saveForm();
            await formPage.toBeHidden();

            await row.click();
            await formPage.toBeVisible();
            await formPage.assertInlineRepeatFieldValues(sectionHeadlineLabel, addressData);
        });

        test("should add 3 phone numbers", async () => {
            const sectionHeadlineLabel = "Phone";
            const row = overviewPage.getRow(updateData[0].value);
            await row.click();
            await formPage.toBeVisible();
            await formPage.inputInlineRepeatFieldValues(sectionHeadlineLabel, phoneNumberData);
            await formPage.saveForm();
            await formPage.toBeHidden();

            await row.click();
            await formPage.toBeVisible();
            await formPage.assertInlineRepeatFieldValues(sectionHeadlineLabel, phoneNumberData);
        });

        test("should delete a company", async () => {
            await overviewPage.deleteDocument(updateData[0].value);
        });
    });
});
