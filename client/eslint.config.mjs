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

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import jambitTypedReduxSaga from "@jambit/eslint-plugin-typed-redux-saga";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: [
            "**/build",
            "**/resources",
            "**/node_modules/",
            "**/target",
            "**/scripts",
            "**/webpack.*.js",
            "prettier.config.js",
            "eslint.config.mjs",
            "**/*.generated.*"
        ]
    },
    {
        files: ["**/*.ts", "**/*.tsx"]
    },
    ...fixupConfigRules(
        compat.extends(
            "eslint:recommended",
            "plugin:@typescript-eslint/eslint-recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:import/typescript",
            "plugin:react/recommended",
            "plugin:react/jsx-runtime",
            "plugin:react-hooks/recommended",
            "prettier"
        )
    ),
    {
        plugins: {
            "@typescript-eslint": fixupPluginRules(typescriptEslint),
            import: fixupPluginRules(_import),
            "@jambit/typed-redux-saga": jambitTypedReduxSaga
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },

            parser: tsParser
        },
        settings: {
            "import/internal-regex": "^@com.mgmtp.a12",
            react: {
                version: "detect"
            }
        },
        rules: {
            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],

                    pathGroups: [
                        {
                            pattern: "../**",
                            group: "parent",
                            position: "after"
                        }
                    ],

                    "newlines-between": "always"
                }
            ],

            "import/newline-after-import": [
                "error",
                {
                    count: 1
                }
            ],

            "import/no-duplicates": "error",

            curly: "error",
            eqeqeq: "error",
            "@jambit/typed-redux-saga/use-typed-effects": "error",
            "@jambit/typed-redux-saga/delegate-effects": "error",
            "no-console": "error",

            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        "../**/internal/*",
                        "@com.mgmtp.a12*/**/internal/**",
                        "@com.mgmtp.a12*/**/a12internal/**",
                        "@com.mgmtp.a12*/**/src/**",
                        "lodash*"
                    ]
                }
            ],

            "import/no-internal-modules": [
                "warn",
                {
                    forbid: ["@com.mgmtp.a12*/*/*/**"]
                }
            ],

            "max-nested-callbacks": [
                "error",
                {
                    max: 3
                }
            ],

            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: false,
                    optionalDependencies: false,
                    peerDependencies: false,
                    bundledDependencies: false
                }
            ],
            "react/prop-types": "off"
        }
    }
];
