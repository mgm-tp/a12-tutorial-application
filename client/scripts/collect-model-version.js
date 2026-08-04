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
const __dirname = Path.dirname(__filename)

function collectA12ModelVersions() {
    const nodeModulesPath = Path.join(__dirname, "..", "node_modules");

    const modelVersionMap = {};

    for (const a12ScopeDir of Fs.readdirSync(nodeModulesPath)) {
        if (!a12ScopeDir.startsWith("@com.mgmtp.a12")) {
            continue;
        }

        // scan sub directories for package.json files
        const scopeDirPath = Path.join(nodeModulesPath, a12ScopeDir);
        for (const a12Library of Fs.readdirSync(scopeDirPath)) {
            const packageJsonPath = Path.join(scopeDirPath, a12Library, "package.json");
            if (!Fs.existsSync(packageJsonPath)) {
                continue;
            }

            const packageJson = JSON.parse(Fs.readFileSync(packageJsonPath));
            const { modelVersion, modelType } = packageJson;

            if (modelType && modelVersion) {
                modelVersionMap[modelType] = modelVersion;
            }
        }
    }
    return modelVersionMap;
}

export default collectA12ModelVersions;
