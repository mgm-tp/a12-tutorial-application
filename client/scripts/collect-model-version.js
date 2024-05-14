const fs = require("fs");
const path = require("path");

function collectA12ModelVersions() {
    const nodeModulesPath = path.join(__dirname, "..", "node_modules");

    const modelVersionMap = {};

    for (const a12ScopeDir of fs.readdirSync(nodeModulesPath)) {
        if (!a12ScopeDir.startsWith("@com.mgmtp.a12")) {
            continue;
        }

        // scan sub directories for package.json files
        const scopeDirPath = path.join(nodeModulesPath, a12ScopeDir);
        for (const a12Library of fs.readdirSync(scopeDirPath)) {
            const packageJsonPath = path.join(scopeDirPath, a12Library, "package.json");
            if (!fs.existsSync(packageJsonPath)) {
                continue;
            }

            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
            const { modelVersion, modelType } = packageJson;

            if (modelType && modelVersion) {
                modelVersionMap[modelType] = modelVersion;
            }
        }
    }
    return modelVersionMap;
}

module.exports = collectA12ModelVersions;