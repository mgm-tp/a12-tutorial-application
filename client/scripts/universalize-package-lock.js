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
 * Processes package-lock.json in the client directory.
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
        Path.join(projectRoot, "client", "package-lock.json")
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
