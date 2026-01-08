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

import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

/** Mock IntersectionObserver - Required by A12 AttachedPortal component */
class MockIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
}

Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver
});

Object.defineProperty(global, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver
});

/** Mock ResizeObserver - Prevents warnings from react-resize-detector in A12 SizeContext */
class MockResizeObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: MockResizeObserver
});

Object.defineProperty(global, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: MockResizeObserver
});

/** Mock A12 FormEngine content elements - avoids SVG import chain from widgets-core */
vi.mock("@com.mgmtp.a12.formengine/formengine-content-elements", () => ({
    FormElementsLibrary: { modules: [] }
}));

/** Mock A12 ContentEngine default element library - avoids SVG import chain from widgets-core */
vi.mock("@com.mgmtp.a12.contentengine/contentengine-default-element-library", () => ({
    DefaultElementLibrary: { get: () => ({ modules: [] }) },
    DefaultElementLibraryFactories: {
        createModule: () => ({ id: "DefaultElementLibraryModule" })
    }
}));

/**
 * A12 OverviewEngine Core Mocks
 * Mock DefaultComponentMap to isolate unit tests from the full A12 component tree.
 * All other barrel exports (OverviewModel, useOverviewEngineContext, etc.) come from
 * the real library via importOriginal.
 * Components render as simple divs for predictable, dependency-free testing.
 */
vi.mock("@com.mgmtp.a12.overviewengine/overviewengine-core", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@com.mgmtp.a12.overviewengine/overviewengine-core")>();
    return {
        ...actual,
        DefaultComponentMap: {
            TableBodyCell: vi.fn(({ children }) =>
                React.createElement("div", { "data-testid": "default-table-body-cell" }, children)
            ),
            Heading: vi.fn(({ children }) => React.createElement("div", { "data-testid": "default-heading" }, children))
        }
    };
});
