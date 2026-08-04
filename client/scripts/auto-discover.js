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
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const __dirname = import.meta.dirname;

const AUTO_GENERATED_MARKER = "// AUTO-GENERATED - DO NOT EDIT. Run 'npm run generate' to regenerate.\n";

const srcDir = Path.join(__dirname, "..", "src");
const modulesDir = Path.join(srcDir, "modules");
const themesDir = Path.join(srcDir, "themes");

const modulesOutput = Path.join(modulesDir, "modules.generated.ts");
const themesOutput = Path.join(themesDir, "themes.generated.ts");

function convertFileNameToDisplayName(fileName) {
    return fileName
        .replace(/^\.\/|\.json$/g, "")
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isValidIdentifier(name) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

function writeIfChanged(filePath, body) {
    let header = "";
    let existing = null;

    if (Fs.existsSync(filePath)) {
        existing = Fs.readFileSync(filePath, "utf8");
        const markerEnd = existing.indexOf(AUTO_GENERATED_MARKER);
        if (markerEnd !== -1) {
            header = existing.slice(0, markerEnd + AUTO_GENERATED_MARKER.length);
        }
    }

    const content = header + body;
    if (existing !== content) {
        Fs.writeFileSync(filePath, content, "utf8");
    }
}

function generateModules() {
    const entries = Fs.readdirSync(modulesDir, { withFileTypes: true });
    const moduleNames = entries
        .filter((entry) => entry.isDirectory() && Fs.existsSync(Path.join(modulesDir, entry.name, "index.ts")))
        .map((entry) => entry.name);

    for (const name of moduleNames) {
        if (!isValidIdentifier(name)) {
            throw new Error(
                `Module folder "${name}" is not a valid JavaScript identifier. ` +
                    `Please use camelCase (e.g., "myModule" instead of "my-module").`
            );
        }
    }

    let body = `import type { Module } from "@com.mgmtp.a12.client/client-core";\n`;
    if (moduleNames.length > 0) {
        body += "\n";
        for (const name of moduleNames) {
            body += `import ${name} from "./${name}";\n`;
        }
    }
    body += "\n";
    body += `export const modules: Module[] = [${moduleNames.join(", ")}];\n`;

    writeIfChanged(modulesOutput, body);
}

const defaultThemeProperties = Object.keys(getBaseTheme());

function assertShallowValidTheme(themePath) {
    try {
        const themeFile = JSON.parse(Fs.readFileSync(themePath, "utf-8"));
        assertNoMismatch(Object.keys(themeFile));
    } catch (e) {
        throw new Error(`Theme file "${Path.basename(themePath)}" is not valid. Issue: ${e?.message}`);
    }

    function assertNoMismatch(themeProperties) {
        const mismatch = themeProperties.find((prop) => !defaultThemeProperties.includes(prop));
        if (mismatch) {
            throw new Error(
                `Shallow check failed. Property "${mismatch}" is not allowed. Expected props are "${defaultThemeProperties.join('", "')}`
            );
        }
    }
}

function generateThemes() {
    const entries = Fs.readdirSync(themesDir).filter((f) => f.endsWith(".json"));

    const themeEntries = entries.map((fileName) => {
        const displayName = convertFileNameToDisplayName(fileName);
        const importName = displayName.replace(/\s+/g, "");
        if (!isValidIdentifier(importName)) {
            throw new Error(
                `Theme file "${fileName}" produces an invalid import name "${importName}". ` +
                    `Theme filenames must start with a letter.`
            );
        }
        assertShallowValidTheme(Path.join(themesDir, fileName));
        return { fileName, displayName, importName };
    });

    let body = themeEntries.map(({ importName, fileName }) => `import ${importName} from "./${fileName}";\n`).join("");
    body += "\n";
    body += "const autoDiscoveredThemes = {\n";
    body +=
        themeEntries.map(({ displayName, importName }) => `    "${displayName}": ${importName}`).join(",\n") ||
        `    // No custom theme provided in "themes" folder`;
    body += "\n};\n";
    body += "\n";
    body += "export default autoDiscoveredThemes;\n";

    writeIfChanged(themesOutput, body);
}

function autoDiscover() {
    generateModules();
    generateThemes();
}

if (process.argv[1] === import.meta.filename) {
    autoDiscover();
}
