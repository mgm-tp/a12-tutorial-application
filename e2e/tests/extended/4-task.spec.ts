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

import { test } from "../../fixtures";
import { OverviewPage } from "../../pages/OverviewPage";
import { DataType, type TestData } from "../../types";

const projectData: TestData[] = [
    { label: "Name", value: "FlexiFlow", type: DataType.String },
    { label: "Description", value: "Flexible Flow", type: DataType.String }
];

const now = new Date().valueOf();
const taskData: TestData[] = [
    {
        label: "Title",
        value: `Create CDM document ${now}`,
        type: DataType.String
    },
    { label: "Status", value: "Done", type: DataType.Select }
];

test.describe.serial("Task CDM Module", () => {
    let overviewPage: OverviewPage;
    test.beforeEach(async ({ getPageAs }) => {
        const page = await getPageAs("admin");
        overviewPage = new OverviewPage(page);
        await overviewPage.gotoHome();
        await overviewPage.switchOnEnglish();
        await overviewPage.clickMenuItem("Task");
    });

    test("should add Task with Project", async () => {
        await overviewPage.addComposeDocument(taskData, projectData);
    });

    test("should export documents to CSV", async () => {
        await overviewPage.exportDocumentsToCSV("export_Task_CDM.csv");
    });
});
