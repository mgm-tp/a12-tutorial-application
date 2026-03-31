import Fs from "node:fs";
import Path from "node:path";

const __dirname = import.meta.dirname;

const HEADER = "// AUTO-GENERATED - DO NOT EDIT. Run 'npm run generate' to regenerate.\n";

const srcDir = Path.join(__dirname, "..", "src");
const modulesDir = Path.join(srcDir, "modules");

const modulesOutput = Path.join(modulesDir, "modules.generated.ts");

function isValidIdentifier(name) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

function writeIfChanged(filePath, content) {
    if (Fs.existsSync(filePath) && Fs.readFileSync(filePath, "utf8") === content) {
        return;
    }
    Fs.writeFileSync(filePath, content, "utf8");
}

function generateModules() {
    const entries = Fs.readdirSync(modulesDir, { withFileTypes: true });
    const moduleNames = entries
        .filter((entry) => entry.isDirectory() && Fs.existsSync(Path.join(modulesDir, entry.name, "index.ts")))
        .map((entry) => entry.name);

    for (const name of moduleNames) {
        if (!isValidIdentifier(name)) {
            throw new Error(
                `Module folder "${name}" is not a valid JavaScript identifier. ` +
                    `Please use camelCase (e.g., "myModule" instead of "my-module").`
            );
        }
    }

    let content = HEADER;
    content += `import type { Module } from "@com.mgmtp.a12.client/client-core";\n`;
    if (moduleNames.length > 0) {
        content += "\n";
        for (const name of moduleNames) {
            content += `import ${name} from "./${name}";\n`;
        }
    }
    content += "\n";
    content += `export const modules: Module[] = [${moduleNames.join(", ")}];\n`;

    writeIfChanged(modulesOutput, content);
}




function autoDiscover() {
    generateModules();
}

if (process.argv[1] === import.meta.filename) {
    autoDiscover();
}
