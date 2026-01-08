import "@testing-library/jest-dom";
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
