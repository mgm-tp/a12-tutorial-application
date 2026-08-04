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

import { expect, type Locator } from "@playwright/test";

import { Attribute, TestID } from "../types/testIds";

import { OverviewPage } from "./OverviewPage";

export class TreePage extends OverviewPage {
    getTreeNodesAtLevel(level: number = 0): Locator {
        return this.page.locator(`[${Attribute.DATA_TREE_LEVEL}="${level}"]`).getByTestId(TestID.TABLE_BODY_ROW);
    }

    async assertExpandableRowTitles(documents: string[]) {
        for (const content of documents) {
            await expect(
                this.page
                    .getByTestId(TestID.TABLE_BODY_ROW)
                    .filter({ has: this.page.getByTestId(TestID.TREE_NODE_EXPANDER) })
                    .getByTestId(TestID.TREE_NODE_NAME)
                    .filter({ hasText: content })
            ).toBeVisible();
        }
        return;
    }

    async assertNotExpandableRowTitles(documents: string[]) {
        for (const content of documents) {
            await expect(
                this.page
                    .getByTestId(TestID.TABLE_BODY_ROW)
                    .filter({ hasNot: this.page.getByTestId(TestID.TREE_NODE_EXPANDER) })
                    .getByTestId(TestID.TREE_NODE_NAME)
                    .filter({ hasText: content })
            ).toBeVisible();
        }
    }

    async expandAll() {
        await this.page
            .getByTestId(TestID.CONTENTBOX_GROUP_ACTION_BAR)
            .getByTestId(TestID.POPUP_TRIGGER_ELEMENT)
            .click();
        await expect(this.page.getByTestId(TestID.POPUP_MENU)).toBeVisible();
        await this.page
            .getByTestId(TestID.POPUP_MENU)
            .getByTestId(TestID.LIST_ITEM)
            .filter({ hasText: "Expand All" })
            .click();
        await this.finishedLoading();
    }

    async collapseAll() {
        await this.page
            .getByTestId(TestID.CONTENTBOX_GROUP_ACTION_BAR)
            .getByTestId(TestID.POPUP_TRIGGER_ELEMENT)
            .click();
        await this.page
            .getByTestId(TestID.POPUP_MENU)
            .getByTestId(TestID.LIST_ITEM)
            .filter({ hasText: "Collapse All" })
            .click();
    }

    async shouldBeExpanded(row: Locator) {
        await expect(row.getByTestId(TestID.TREE_NODE_EXPANDER).locator('[aria-expanded="true"]')).toBeVisible();
    }

    async shouldNotBeExpanded(row: Locator) {
        await expect(row.getByTestId(TestID.TREE_NODE_EXPANDER).locator('[aria-expanded="false"]')).toBeVisible();
    }

    async expandNode(row: Locator) {
        await row.getByTestId(TestID.TREE_NODE_EXPANDER).locator('[aria-expanded="false"]').click();
    }

    async collapseNode(row: Locator) {
        await row.getByTestId(TestID.TREE_NODE_EXPANDER).locator('[aria-expanded="true"]').click();
    }

    async dragAndDrop(source: Locator, target: Locator) {
        await source.dragTo(target);
    }
}
