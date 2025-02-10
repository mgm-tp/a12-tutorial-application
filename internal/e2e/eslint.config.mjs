
import clientRules from "../../client/eslint.config.mjs";

export default [
    {
        ignores: ["**/node_modules", "cypress.config.ts", "**/plugins/index.js"]
    },
    ...clientRules,
    {
        settings: {
            react: {
                version: "18.2"
            }
        },
        rules: {
            "@typescript-eslint/no-namespace": "off",
            "max-nested-callbacks": ["error", 5]
        },
    }
];
