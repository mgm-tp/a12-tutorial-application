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

import Fs from "node:fs";
import Path from "node:path";
import Url from "node:url";

const __filename = Url.fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

/**
 * The method aims to update the `package-lock.json` files by removing certain lines containing the terms "resolved" and "integrity".
 * Its purpose is to provide universal `package-lock.json` files, independent of partner configuration, with fixed dependency versions.
 * This ensures consistency and predictability in the project's dependencies across different environments and setups.
 *
 * Processes package-lock.json in both client and e2e directories.
 */

/**
 * Process a single package-lock.json file
 * @param {string} filePath - Absolute path to the package-lock.json file
 */
function processPackageLock(filePath) {
    if (!Fs.existsSync(filePath)) {
        throw new Error(`The path does not exist: ${filePath}`);
    }

    console.log("Starting to update file with path: ", filePath);
    const contents = Fs.readFileSync(filePath, "utf-8");
    const replaced = contents
        .replace(/.*"resolved".*/g, "") // Remove lines with "resolved" property.
        .replace(/^(?=\n)|\s*$|\n\n+/gm, "") // Cleanup whitespaces.
        .replace(/,(?=\s*?(}|]))/g, ""); // Remove trailing commas ",".

    try {
        JSON.parse(replaced);
    } catch (e) {
        throw new Error(`Failed to parse JSON for ${filePath}: ${e.message}`);
    }

    Fs.writeFileSync(filePath, replaced + "\n", "utf-8");
    console.log("Updating completed for:", filePath);
}

(() => {
    const projectRoot = Path.join(__dirname, "..", "..");
    const packageLockPaths = [
        Path.join(projectRoot, "client", "package-lock.json"),
        Path.join(projectRoot, "e2e", "package-lock.json")
    ];

    console.log("Processing package-lock.json files...");

    try {
        for (const filePath of packageLockPaths) {
            processPackageLock(filePath);
        }
        console.log("All package-lock.json files updated successfully.");
    } catch (error) {
        console.error("Failed to process files:", error.message);
        process.exit(1);
    }
})();
