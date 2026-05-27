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
import { OverviewPage } from "../../pages/OverviewPage";
import { DataType, type FieldTestData, type TestData } from "../../types";
import { TestID } from "../../types/testIds";

const personData: TestData[] = [
    { label: "First Name", value: "Corvus", type: DataType.String },
    { label: "Last Name", value: "Corax", type: DataType.String },
    { label: "Gender", value: "Male", type: DataType.Select },
    { label: "Date of Birth", value: "10/13/1958", type: DataType.String },
    { label: "Place of Birth", value: "Lycaeus", type: DataType.String },
    {
        label: "Email Address",
        value: "corvuscorax@mgm-tp.com",
        type: DataType.String
    },
    { label: "Nationality", value: "British", type: DataType.String },
    {
        locator: `[data-role=${TestID.FILE_UPLOAD_CONTROL}]`,
        filePath: fileURLToPath(new URL("../../fixtures/image.png", import.meta.url)),
        value: "image.png",
        type: DataType.File
    }
];

const companyData: FieldTestData[] = [
    { label: "Company Name", value: "Raven Guard", type: DataType.String },
    { label: "Website", value: "https://ravenguard.com", type: DataType.String }
];

test.describe("Employment Module", () => {
    test.describe.serial("Employment Module - Create", () => {
        let overviewPage: OverviewPage;

        test.beforeEach(async ({ getPageAs }) => {
            const page = await getPageAs("admin");
            overviewPage = new OverviewPage(page);
            await overviewPage.gotoHome();
            await overviewPage.clickMenuItem("Employment");
        });

        test("should create a new employment", async () => {
            await overviewPage.addComposeDocument(personData, companyData);

            await overviewPage.assertThumbnailInTable("image.png", overviewPage.getRow(personData[0].value));

            await overviewPage.clickMenuItem("Employment");
            await overviewPage.assertDocumentsInTable([companyData[0].value]);
        });
    });
});
