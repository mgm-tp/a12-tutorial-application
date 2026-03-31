import Fs from "node:fs";
import Path from "node:path";
import Url from "node:url";

const __filename = Url.fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename)

function collectA12ModelVersions() {
    const nodeModulesPath = Path.join(__dirname, "..", "node_modules");

    const modelVersionMap = {};

    for (const a12ScopeDir of Fs.readdirSync(nodeModulesPath)) {
        if (!a12ScopeDir.startsWith("@com.mgmtp.a12")) {
            continue;
        }

        // scan sub directories for package.json files
        const scopeDirPath = Path.join(nodeModulesPath, a12ScopeDir);
        for (const a12Library of Fs.readdirSync(scopeDirPath)) {
            const packageJsonPath = Path.join(scopeDirPath, a12Library, "package.json");
            if (!Fs.existsSync(packageJsonPath)) {
                continue;
            }

            const packageJson = JSON.parse(Fs.readFileSync(packageJsonPath));
            const { modelVersion, modelType } = packageJson;

            if (modelType && modelVersion) {
                modelVersionMap[modelType] = modelVersion;
            }
        }
    }
    return modelVersionMap;
}

export default collectA12ModelVersions;
