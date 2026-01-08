/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        clearMocks: true,
        setupFiles: ["./src/tests/setup.ts"],
        include: ["src/tests/**/*.test.{ts,tsx}"],
        coverage: {
            reporter: ["text"],
            include: ["src/modules/contact/components/HighlightedDateOverview/**"]
        }
    }
});
