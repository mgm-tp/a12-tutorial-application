#!/usr/bin/env groovy

import groovy.transform.Field

String buildVersion = ''
String downstreamBuildResult = 'Not triggerred'

// BEGIN environment specific variables
// TODO: Adapt the following variables according to your Jenkins build environment
String BUILD_AGENT_LABEL = 'linux-node'
String GRADLE_VERSION = 'Gradle7'
@Field
String JDK_VERSION = 'OpenJDK17'
@Field
String NODE_JS_VERSION = 'Node18'
@Field
String GRADLE_SETTINGS_FILE_REF = 'gradle-settings'
@Field
String NODE_JS_CONFIG_REF = 'npmrc'
@Field
String CI_USER_REF = 'ci-user-artifactory-token'
// END environment specific variables

// BEGIN deployment specific variables
// TODO: Adapt the following variables according to your deployment job and repository branch
// DOWNSTREAM_DEPLOYMENT_JOB_PATH: is the path to the job used to deploy your application to `int` environment obtained from implementing the Project Deployment Template.
// CI_DEPLOYMENT_TRIGGER_BRANCH: for any updates on this branch, this pipeline job will trigger the down stream deployment job above to deploy your application to the `int` environment.

String DOWNSTREAM_DEPLOYMENT_JOB_PATH = 'BD/deployment-pipelines/deployment-all-v2/'
String CI_DEPLOYMENT_TRIGGER_BRANCH = 'main'
// END deployment specific variables

pipeline {
    agent { label BUILD_AGENT_LABEL }
    tools {
        gradle GRADLE_VERSION
        jdk JDK_VERSION
    }
    environment {
        GRADLE_USER_HOME = "${WORKSPACE}/.gradle"
    }
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))

    }

    stages {

        stage('Review') {
            when {
                allOf {
                    anyOf {
                        triggeredBy 'BranchIndexingCause'
                        triggeredBy 'BranchEventCause'
                        triggeredBy "UserIdCause"
                    }
                    changeRequest()
                }
            }
            steps {
                script {
                    withBuildConfiguration {
                        sh 'gradle test'
                        String projectVersion = sh script: 'gradle getVersion -q', returnStdout: true
                        currentBuild.displayName += ': ' + projectVersion
                    }
                }
            }
        }

        stage('Pre-release') {
            when {
                branch CI_DEPLOYMENT_TRIGGER_BRANCH
            }
            steps {
                script {
                    withBuildConfiguration {
                        sh 'gradle prerelease'
                        String projectVersion = sh script: 'gradle getVersion -q', returnStdout: true
                        currentBuild.displayName += ': ' + projectVersion
                        buildVersion = projectVersion
                    }
                }
            }
        }

        stage('Deploy on INT') {
            when {
                branch CI_DEPLOYMENT_TRIGGER_BRANCH
            }
            steps {
                script {
                    withBuildConfiguration {
                        echo 'Deploying to INT environment.'
                        def deployJob = build job: DOWNSTREAM_DEPLOYMENT_JOB_PATH + URLEncoder.encode(CI_DEPLOYMENT_TRIGGER_BRANCH, 'UTF-8'),
                                        parameters: [
                                            string(name: 'ENVIRONMENT_NAME', value: 'int'),
                                            string(name: 'APPLICATION_VERSION', value: buildVersion)
                                        ],
                                        //getting a downstream build result even if it finishes unsuccessfully
                                        propagate: false
                        downstreamBuildResult = deployJob.result
                        switch (downstreamBuildResult) {
                            case null:
                                error "Status for a started downstream deployment job is not available."
                                break
                            case 'SUCCESS':
                                echo "Deploy to INT environment with status $downstreamBuildResult."
                                break
                            default:
                                echo "Deploy to INT environment with status $downstreamBuildResult."
                                currentBuild.result = downstreamBuildResult
                                catchError(buildResult: null, stageResult: downstreamBuildResult) {
                                    sh "exit 1"
                                }
                                break
                        }
                    }
                }
            }
        }

    }

    post {
        always {
            withBuildConfiguration {
                script {
                    sh "gradle cleanImages || true"
                }
            }
        }

        cleanup {
            cleanWs cleanWhenFailure: false, cleanWhenNotBuilt: false, cleanWhenUnstable: false, notFailBuild: true
        }
    }
}

void withBuildConfiguration(Closure body) {
    withCredentials([usernamePassword(credentialsId: CI_USER_REF, usernameVariable: 'repository_username', passwordVariable: 'repository_password')]) {
        configFileProvider([configFile(fileId: GRADLE_SETTINGS_FILE_REF, targetLocation: GRADLE_USER_HOME + '/init.d/settings.gradle')]) {
            nodejs(configId: NODE_JS_CONFIG_REF, nodeJSInstallationName: NODE_JS_VERSION) {
                body()
            }
        }
    }
}

