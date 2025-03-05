package com.mgmtp.a12

import groovy.ant.AntBuilder
import groovy.json.JsonSlurper
import org.apache.commons.lang3.SystemUtils
import org.gradle.api.file.ConfigurableFileTree
import org.gradle.api.provider.ProviderFactory
import org.gradle.util.GradleVersion
import org.semver4j.Semver

class ToolProperties {
    String tool
    String toolSystemVersion
    String versionsFileVersion
    boolean versionSatisfies
}

class Utils {
    static final String FS = File.separator

    /**
     * Compares tool version installed on OS with recommended version in version file.
     *
     * @param providers ProviderFactory instance.
     * @param versionFile File with the list of tools and recommended versions.
     *
     * @return Map of tool properties after the comparison.
     */
    static Map checkAllToolVersions(ProviderFactory providers, File versionFile) {
        def tools = new JsonSlurper().parseText(versionFile.text).tools.keySet()
        println "Checking prerequisite tools versions for ${tools.join(', ')}"
        def toolProperties = new HashMap<String, ToolProperties>()
        tools.each { tool -> toolProperties[tool] = getToolVersion(providers, versionFile, tool) }

        if (toolProperties.values().any { !it.versionSatisfies }) {
            println "WARNING: If tools do not satisfy recommended versions, the process can finish unexpectedly."
        }

        return toolProperties
    }

    private static Map executeVersionCheckCommand(ProviderFactory providers, String command) {
        def args = command.split(" ")

        def versionCommandExec = providers.exec {
            commandLine(args)
            ignoreExitValue = true
        }
        def toolInstalled = versionCommandExec.getResult().get().getExitValue() == 0

        def versionText = toolInstalled ? versionCommandExec.getStandardOutput().asText.get().strip() : "N/A"

        return [toolInstalled: toolInstalled, toolVersion: versionText]
    }

    private static ToolProperties getToolVersion(ProviderFactory providers, File versionFile, String tool) {
        def isWindows = SystemUtils.IS_OS_WINDOWS
        def checkedTool = tool.toLowerCase()
        def toolSystemVersion = 'N/A'
        def versionCommand = ""
        //additional issue message specific for the tool
        def issueMessage = ""

        switch(checkedTool) {
            case 'node':
                versionCommand = 'node -v'
                break
            case 'npm':
                versionCommand = "${isWindows ? 'npm.cmd -v' : 'npm -v'}"
                break
            case 'jdk':
                toolSystemVersion = System.getProperty("java.version")
                break
            case 'gradle':
                toolSystemVersion = GradleVersion.current().toString()
                break
            case 'docker':
                versionCommand = "docker version --format {{.Server.Version}}"
                issueMessage = "\nCheck if Docker daemon is running properly, for example by running 'docker version'."
                break
            case 'docker compose':
                versionCommand = "docker compose version --short"
                issueMessage = "\nCheck if Docker compose is installed, for example by running 'docker compose version'."
                break
            default:
                throw new Exception("Tool '$tool' is unknown for 'checkToolVersion' method")
        }

        //Catch the exception when command fails if the tool does not exist in the system.
        try {
            if (versionCommand) {
                def versionCheckResult = executeVersionCheckCommand(providers, versionCommand)
                if (versionCheckResult.toolInstalled) {
                    toolSystemVersion = versionCheckResult.toolVersion
                } else {
                    println "[X] There is probably no '$tool' running on the system. Tool version check for '$tool' finished with non-zero exit value: " + issueMessage
                }
            }
        } catch (Exception e) {
            println "[X] There is probably no '$tool' installed on the system. Tool version check for '$tool' finished with error:\n"+e
        }

        def parsedVersionsJson = new JsonSlurper().parseText(versionFile.text)
        def versionsFileVersion = String.valueOf(parsedVersionsJson.tools."$checkedTool".version)
        //format the version to semver style if necessary
        def coercedVersionsFileVersion = Semver.coerce(versionsFileVersion)

        //Semver.satisfies allows to make loose comparison of different version formats
        boolean versionSatisfies = toolSystemVersion.equals('N/A') ? false : Semver.coerce(toolSystemVersion).satisfies(versionsFileVersion)


        if (!toolSystemVersion.equals('N/A')) {
            //Windows commandline cannot handle the 'checkmark' character properly
            def checkMessage = versionSatisfies ? (isWindows ? "[ok] " : "[\u2713] ") : "[X] "
            checkMessage += parsedVersionsJson.tools."$checkedTool".name + " "
            checkMessage += versionSatisfies ? "(version: ${Semver.coerce(toolSystemVersion)})" : "$toolSystemVersion => did not satisfy '${versionsFileVersion}'"
            println checkMessage
        }

        return new ToolProperties(tool: checkedTool, toolSystemVersion: toolSystemVersion, versionsFileVersion: coercedVersionsFileVersion, versionSatisfies: versionSatisfies)
    }

    /**
     * Replace all occurrences of PT placeholder names
     *
     * @param setupFile File contains parameters that used for placeholder replacement
     * @param fileTree File tree that contains all files in project
     * @param projectDir The project directory path
     */
    static void replacePlaceholders(File setupFile, ConfigurableFileTree fileTree, String projectDir) {
        def includedFiles = ['**/*.json', '**/*.gradle', '**/*.properties', '**/*.yml', '**/*.html', '**/*.ts', '**/*.java', '.run/*.xml', 'quality/**', '**/.env']
        def excludedDirs = ['**/logs/**', '**/resource/**', '**/.gradle/**', '**/buildSrc/**', '**/target/**', '**/build/**', '**/node_modules/**', 'build.gradle', "**/internal/**"]
        // Backslashes in a text have to be escaped for JsonSlurper parsing
        def escapedText = setupFile.text.replace("\\", "\\\\")
        def setupJsonMap = new JsonSlurper().parseText(escapedText) as Map<String, String>

        String[] serverModules = ["server${FS}app", "server${FS}init"]

        def curProps = loadFileToMap(setupJsonMap, 'current')
        def altProps = loadFileToMap(setupJsonMap, 'alternative')

        validateSetupFile(curProps, altProps)

        correctPropsFormat(altProps)
        if (curProps['serverPackage'] && altProps['serverPackage'] && (curProps['serverPackage'] != altProps['serverPackage'])) {
            updatePackageStructure(serverModules, curProps['serverPackage'], altProps['serverPackage'], projectDir)
        }

        fileTree
                .include(includedFiles)
                .exclude(excludedDirs)
                .each { filterable ->
                    def file = new File(filterable.path)
                    def content = file.getText('UTF-8')
                    def isChanged = false

                    curProps.each {
                        if ((curProps[it.key] != altProps[it.key]) && content.contains(curProps[it.key])) {
                            content = content.replace(it.value,altProps[it.key])
                            isChanged = true
                        }
                    }

                    if (isChanged) {
                        file.write(content, 'UTF-8')
                        println "Updated ${file.path}"

                        def fileName = file.name

                        def propsToFileChange = ['appModelName', 'serverApplication', 'initApplication']
                        propsToFileChange.each {
                            def fileType = ''
                            if (it == "appModelName") fileType = '.json'
                            if (it == "serverApplication") fileType = '.java'
                            if (it == "initApplication") fileType = '.java'

                            if (fileName == "${curProps[it]}${fileType}" && curProps[it] != altProps[it]) {
                                renameFile(file, altProps[it], fileType)
                            }
                        }
                    }
                }
    }

    static void updatePackageStructure(String[] modules, String curGroup, String altGroup, String projectDir) {
        def packageRegex = '^([a-zA-Z_]\\w*)+([.][a-zA-Z_]\\w*)*$'
        def fs = File.separator

        modules.each { module ->
            def basePath = "${projectDir}${fs}${module}${fs}src${fs}main${fs}java${fs}"
            def curPath = "${basePath}${curGroup.replace('.', fs)}"
            def curDir = new File(curPath)

            if (!curDir.exists()) {
                throw new Exception("Path \'$curDir.path\' does not exist.")
            }

            if (altGroup.matches(packageRegex)) {
                    def altPath = "${basePath}${altGroup.replace('.', fs)}"
                    new AntBuilder().move(todir: altPath, overwrite: true, force: true, flatten: false) {
                        fileset(dir: curPath, includes: '**/*.*')
                    }
                    cleanUpDirs(basePath, curPath)
            } else {
                throw new Exception("The serverPackage name \'$altGroup\' is invalid for package name. The name should follow this regular expression pattern:\'$packageRegex\', e.g., your.project.name, your.project_name or your_project_name")
            }
        }
    }

    static boolean hasEmptyValues(Map<String, String> map) {
        return map.values().any { it == null || it.toString().trim().empty}
    }

    static void correctPropsFormat(Map<String, String> altProps) {
        altProps.each {
            def key = it.key
            if (['projectName', 'serverPackage', 'projectGroup', 'projectProperties'].contains(key)) {
                it.value = it.value?.toLowerCase()
            }
        }
    }

    static Map<String, String> loadFileToMap(Map<String, String> setupJsonMap, String type) {
        setupJsonMap.collectEntries { [(it.key): it.value[type]] }
    }

    static void validateSetupFile(Map<String, String> curProps, Map<String, String> altProps) {
        if (hasEmptyValues(curProps) || hasEmptyValues(altProps)) {
            throw new Exception("The 'current' or the 'alternative' mappings contain empty values. Please check your setup.json file for these values.")
        }

        if (curProps == altProps) {
            throw new Exception("The 'Current' map and the 'Alternative' map have the same keys and values. This task has no changes applied.")
        }

        // not allow to use the same database name for Keycloak, Dataservice, and Contentstore
        def dbNames = [altProps['keycloakDatabaseName'], altProps['dsDatabaseName'], altProps['csDatabaseName']]
        if (dbNames.toSet().size() != dbNames.size()) {
            throw new Exception("The database names for Keycloak, Dataservice, and Contentstore should be different: " + dbNames)
        }

        // not allow to use the same db username with different passwords
        def dbUsernames = [altProps['keycloakDatabaseUsername'], altProps['dsDatabaseUsername'], altProps['csDatabaseUsername']]
        def dbPasswords = [altProps['keycloakDatabasePassword'], altProps['dsDatabasePassword'], altProps['csDatabasePassword']]
        def dbCredentials = [:]
        dbUsernames.eachWithIndex { username, i ->
            def password = dbPasswords[i]
            if (dbCredentials.containsKey(username)) {
                if (dbCredentials[username] != password) {
                    throw new Exception("Username '${username}' is used with different passwords '${password}' & '${dbCredentials[username]}'." +
                            " Please make sure that the database usernames are unique or have consistent passwords.")
                }
            } else {
                dbCredentials[username] = password
            }
        }
    }

    static void renameFile(File file, String fileName, String fileType) {
        def newName = file.getParent() + File.separator + fileName + fileType
        file.renameTo(newName)
        println "Renamed file \'${file}\' to \'${newName}\'."
    }

    static void cleanUpDirs(String basePath, String packagePath) {
        def targetDir = new File(packagePath)

        if (targetDir.exists() && targetDir.isDirectory()) {
            deleteChildren(targetDir)

            while (targetDir.exists() && targetDir.absolutePath.startsWith(basePath)) {
                if (targetDir.listFiles().size() == 0) {
                    deleteFileTry(targetDir)
                } else {
                    println "Directory ${targetDir} is not empty, will not delete."
                    break
                }
                targetDir = targetDir.parentFile
            }
        } else {
            println "Directory ${targetDir} does not exist."
        }
    }

    static void deleteChildren(File file) {
        if (file.isDirectory()) {
            File[] files = file.listFiles()
            if (files.size() == 0) {
                deleteFileTry(file)
            } else {
                files.each {
                    deleteChildren(it)
                    deleteFileTry(it)
                }
            }
        } else {
            println "${file} is a file, will not delete."
        }
    }

    static void deleteFileTry(File file) {
        try {
            file.delete()
        }
        catch (Exception e) {
            println "Failed to delete directory ${file} with error: $e"
        }
    }

    /**
     * Updates table of tools and versions in given @readmeFile according to the data in given @versionFile
     *
     * @param versionFile Json file where necessary tools and their recommended versions are stored.
     * @param readmeFile README file where the information about necessary tools and recommended versions in easily readable, markdown-formatted table.
     */
    static void updateReadmeToolVersions(File versionFile, File readmeFile) {
        def parsedVersionsJson = new JsonSlurper().parseText(versionFile.text)
        //create header
        def versionTable = "Tool|Version|Note\n---|---|---\n"
        //add data
        parsedVersionsJson.tools.each { key,value ->
            versionTable += "[$value.name]"
            if (value.superscript) {
                versionTable += "<sup>$value.superscript</sup>"
            }
            versionTable += "|\'$value.version\'"
            versionTable += "|$value.note\n"
        }

        //format table in markdown style with given line separator
        def readmeContent = readmeFile.getText('UTF-8')
        def lineSeparator = getLineSeparator(readmeContent)
        versionTable = formatMarkdownTable(versionTable,lineSeparator)

        //replace everything between given tags in README file with formatted table
        def startTag = "<!--- VERSION_TABLE_START \\(Edit versions in tool-versions\\.json, not here\\. Do not delete this tag\\.\\) --->"
        def endTag = "<!--- VERSION_TABLE_END \\(Edit versions in tool-versions\\.json, not here\\. Do not delete this tag\\.\\) --->"
        readmeContent = readmeContent.replaceAll("(?s)(?<=${startTag}$lineSeparator)(.*?)(?=${endTag})","$versionTable")
        readmeFile.write(readmeContent,'UTF-8')
    }

    /**
     * Formats pre-created table in Markdown style:
     *  - adds necessary spaces or hyphens
     *  - adds pipe characters to border the lines
     *
     * @param table String containing the table where rows are divided by Unix '\n' newlines and columns are divided by '|' pipes.
     * @param lineSeparator Desired lineSeparator special character(s) with which should the table be formatted.
     * @return Markdown formatted table.
     */
    static String formatMarkdownTable (String table, String lineSeparator) {
        def rows = table.split('\n')
        def columnMax = [:]
        def tableMap = [:]
        //add table items to map
        rows.eachWithIndex {row, i ->
            tableMap."row$i" = row.split('\\|',-1)
        }
        //count the max length for each column
        tableMap.each {row,content ->
            content.eachWithIndex{ String entry, int j ->
                if (columnMax."column$j" < entry.length()) {
                    columnMax."column$j" = entry.length()
                }
            }
        }

        def formattedTable = ''
        def fillingChar = ' '
        //fill items with necessary number of spaces or hyphens to align columns
        tableMap.each {row,content ->
            content.eachWithIndex{ String entry, int i ->
                fillingChar = (entry ==~ "^(-)\\1*\$") ? '-' : ' '
                entry = entry + fillingChar.multiply(columnMax."column$i" - entry.length())
                //proper Markdown table items have a space before and after the item string
                entry = fillingChar + entry + fillingChar
                formattedTable += '|' + entry
            }
            formattedTable += "|$lineSeparator"
        }
        return formattedTable
    }

    /**
     * Defines what separator is used in the input String. Used instead of System.getProperty('line.separator') to
     * handle WSL environment specifics.
     *
     * @param content String in which the lineSeparator should be searched.
     * @return line separator special character(s) String.
     */
    static String getLineSeparator(String content) {
        def separator
        if (content.contains('\r\n')) {
            separator = '\r\n'
        } else if (content.contains('\n')){
            separator = '\n'
        } else {
            throw new Exception("Line separator not found in given content.")
        }
    }
}
