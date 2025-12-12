const fs = require("fs");
const path = require("path");

/**
 * The method aims to update the `package-lock.json` file by removing certain lines containing the terms "resolved" and "integrity".
 * Its purpose is to provide a universal `package-lock.json`, independent of partner configuration, with fixed dependency versions.
 * This ensures consistency and predictability in the project's dependencies across different environments and setups.
 */

(() => {
    const packageLockPath = path.join(__dirname, "..", "package-lock.json");

    if (!fs.existsSync(packageLockPath)) {
        console.error("The path does not exist: ", packageLockPath);
        process.exit(1);
    }

    console.log("Starting to update file with path: ", packageLockPath);
    const contents = fs.readFileSync(packageLockPath, "utf-8");
    const replaced = contents
        .replace(/.*(resolved|integrity).*/g, "") // Remove lines with "resolved" & "integrity" properties.
        .replace(/^(?=\n)|\s*$|\n\n+/gm, "") // Cleanup whitespaces.
        .replace(/,(?=\s*?(}|]))/g, ""); // Remove trailing commas ",".

    try {
        JSON.parse(replaced);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    fs.writeFileSync(packageLockPath, replaced, "utf-8");
    console.log("Updating completed.");
})();
