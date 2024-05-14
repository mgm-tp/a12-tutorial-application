module.exports = {
    root: true,
    ignorePatterns: ["build/", "lib/"],
    env: {
        browser: true,
        node: true
    },
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier"
    ],
    settings: {
        "import/internal-regex": "^@com.mgmtp.a12",
        react: {
            version: "detect"
        }
    },
    plugins: ["@typescript-eslint", "import", "@jambit/typed-redux-saga"],
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
        "import/newline-after-import": ["error", { count: 1 }],
        curly: "error",
        "@jambit/typed-redux-saga/use-typed-effects": "error",
        "@jambit/typed-redux-saga/delegate-effects": "error",
        "no-console": "error",
        eqeqeq: "error",
        "no-restricted-imports": [
            "error",
            { patterns: ["../**/internal/*", "@com.mgmtp.a12*/**/internal/**", "@com.mgmtp.a12*/**/src/**", "lodash*"] }
        ],
        "max-nested-callbacks": ["error", { max: 3 }],
        "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: false, optionalDependencies: false, peerDependencies: false, bundledDependencies: false }
        ]
    }
};
