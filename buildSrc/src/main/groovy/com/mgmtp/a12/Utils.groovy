package com.mgmtp.a12

import groovy.ant.AntBuilder
import groovy.json.JsonSlurper
import org.apache.commons.lang3.SystemUtils
import org.gradle.api.file.ConfigurableFileTree
import org.gradle.util.GradleVersion
import org.semver4j.Semver

class Utils {
    /**
     * Compares tool version installed on OS with recommended version in version file.
     *
     * @param versionFile File with the list of tools and recommended versions.
     * @param tool Name of the tool to be compared with versionFile.
     *
     * @return Map of tool properties after the comparison.
     */
    static Map checkToolVersion(File versionFile, String tool) {
        def isWindows = SystemUtils.IS_OS_WINDOWS
        def checkedTool = tool.toLowerCase()
        def toolProperties = [tool:"$tool"]
        def toolSystemVersion = 'N/A'
        //additional issue message specific for the tool
        def issueMessage = ""
        switch(checkedTool) {
            case 'node':
                toolProperties.versionCommand ='node -v'
                break;
            case 'npm':
                toolProperties.versionCommand = "${isWindows ? 'npm.cmd -v' : 'npm -v'}"
                break;
            case 'jdk':
                toolSystemVersion = System.getProperty("java.version")
                break;
            case 'gradle':
                toolSystemVersion = GradleVersion.current().toString()
                break;
            case 'docker':
                toolProperties.versionCommand = "docker version --format {{.Server.Version}}"
                issueMessage = "\nCheck if Docker daemon is running properly, for example by running 'docker version'."
                break;
            default:
                throw new Exception("Tool '$tool' is unknown for 'checkToolVersion' method");
                break;
        }

        //Catch the exception when command fails if the tool does not exist in the system.
        try {
            if (toolProperties.versionCommand) {
                def versionCommandProcess = toolProperties.versionCommand.execute()
                def exitValue = versionCommandProcess.waitFor()
                if (exitValue == 0) {
                    toolSystemVersion = versionCommandProcess.text.trim()
                } else {
                    println "[X] There is probably no '$tool' running on the system. Tool version check for '$tool' finished with exit value: " +exitValue +issueMessage
                }
            }
        } catch (Exception e) {
            println "[X] There is probably no '$tool' installed on the system. Tool version check for '$tool' finished with error:\n"+e
        }

        toolProperties.toolSystemVersion = toolSystemVersion

        def parsedVersionsJson = new JsonSlurper().parseText(versionFile.text)
        def versionsFileVersion = parsedVersionsJson.tools."$checkedTool".version
        //format the version to semver style if necessary
        toolProperties.versionsFileVersion = "${Semver.coerce(versionsFileVersion)}"

        boolean versionSatisfies = false
        //Semver.satisfies allows to make loose comparison of different version formats
        versionSatisfies = toolSystemVersion.equals('N/A') ? false : Semver.coerce(toolSystemVersion).satisfies(versionsFileVersion)
        toolProperties.versionSatisfies = versionSatisfies

        if (!toolSystemVersion.equals('N/A')) {
            //Windows commandline cannot handle the 'checkmark' character properly
            def checkMessage = versionSatisfies ? (isWindows ? "[ok] " : "[\u2713] ") : "[X] "
            checkMessage += parsedVersionsJson.tools."$checkedTool".name + " "
            checkMessage += versionSatisfies ? "(version: ${Semver.coerce(toolSystemVersion)})" : "$toolSystemVersion => did not satisfy '${versionsFileVersion}'"
            println checkMessage
        }

        return toolProperties
    }

    /**
     * Replace all occurrences of PT placeholder names
     *
     * @param setupFile File contains parameters that used for placeholder replacement
     * @param fileTree File tree that contains all files in project
     * @param projectDir The project directory path
     */
    static void replacePlaceholders(File setupFile, ConfigurableFileTree fileTree, String projectDir) {
        def includedFiles = ['**/*.json', '**/*.gradle', '**/*.properties', '**/*.yml', '**/*.html', '**/*.ts', '**/*.java', '.run/*.xml', 'quality/checkstyle/*.xml']
        def excludedDirs = ['**/logs/**', '**/resource/**', '**/.gradle/**', '**/buildSrc/**', '**/target/**', '**/build/**', '**/node_modules/**', 'build.gradle']
        def setupJsonMap = new JsonSlurper().parseText(setupFile.text) as Map<String, String>
        def curProps = loadFileToMap(setupJsonMap, 'current')
        def altProps = loadFileToMap(setupJsonMap, 'alternative')

        if (curProps == altProps) {
            println "The 'Current' map and the 'Alternative' map have the same keys and values. This task has no changes applied."
            return
        }

        correctPropsFormat(altProps)
        if (curProps['serverPackage'] && altProps['serverPackage']) {
            updatePackageStructure(curProps['serverPackage'], altProps['serverPackage'], projectDir)
        }

        fileTree
                .include(includedFiles)
                .exclude(excludedDirs)
                .each { filterable ->
                    def file = new File(filterable.path)
                    def content = file.getText('UTF-8')
                    def isChanged = false

                    curProps.each {
                        if (content.contains(it.value)) {
                            content = content.replaceAll(it.value, altProps[it.key])
                            isChanged = true
                        }
                    }

                    if (isChanged) {
                        file.write(content, 'UTF-8')
                        println "Updated ${file.path}"

                        def fileName = file.name

                        def propsToFileChange = ['appModelName', 'serverApplication']
                        propsToFileChange.each {
                            def fileType = ''
                            if (it == "appModelName") fileType = '.json'
                            if (it == "serverApplication") fileType = '.java'

                            if (fileName == "${curProps[it]}${fileType}" && curProps[it] != altProps[it]) {
                                renameFile(file, altProps[it], fileType)
                            }
                        }
                    }
                }
    }

    static void updatePackageStructure(String curGroup, String altGroup, String projectDir) {
        def packageRegex = '^([a-zA-Z_]\\w*)+([.][a-zA-Z_]\\w*)*$'
        def fs = File.separator
        def serverModules = ['app', 'init']

        serverModules.each { module ->
            def basePath = "${projectDir}${fs}server${fs}${module}${fs}src${fs}main${fs}java${fs}"
            def curPath = "${basePath}${curGroup.replace('.', fs)}"
            def curDir = new File(curPath)

            if (!curDir.exists()) {
                throw new Exception("Path \'$curDir.path\' does not exist.")
            }

            if (altGroup.matches(packageRegex)) {
                if (altGroup != curGroup) {
                    def altPath = "${basePath}${altGroup.replace('.', fs)}"
                    new AntBuilder().move(todir: altPath, overwrite: true, force: true, flatten: false) {
                        fileset(dir: curPath, includes: '**/*.*')
                    }
                    cleanUpDirs(basePath, curPath)
                }
            } else {
                throw new Exception("The serverPackage name \'$altGroup\' is invalid for package name. The name should follow this regular expression pattern:\'$packageRegex\', e.g., your.project.name, your.project_name or your_project_name")
            }
        }
    }

    static void correctPropsFormat(Map<String, String> altProps) {
        def title = altProps['title']?.empty
                ? altProps['projectName']?.split('-').collect { it.toLowerCase().capitalize() }.join('-')
                : altProps['title']

        altProps.each {
            def key = it.key
            if (['projectName', 'serverPackage', 'projectGroup', 'projectProperties'].contains(key)) {
                it.value = it.value?.toLowerCase()
            }

            if (key == 'title') {
                it.value = title
            }
        }
    }

    static Map<String, String> loadFileToMap(Map<String, String> setupJsonMap, String type) {
        setupJsonMap.collectEntries { [(it.key): it.value[type]] }
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
