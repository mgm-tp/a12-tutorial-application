<!--- References --->
<!--- Project Template getA12 documentation links --->
[getA12]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM
[Artifactory access]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_artifactory_access
[Gradle Wrapper]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_gradle_wrapper
[Gradle Node plugin]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_gradle_node_plugin
[Environment and Tools Setup]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_environment_and_tools_setup
[Getting Started With the Project]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_getting_started_with_the_project
[Preparation of the Project Template for a New Project]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_preparation_of_the_project_template_for_a_new_project
[Build]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_build
[Run]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_run
[Development Tips]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_development_tips
[Testing]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_testing
[Deployment]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_deployment
[Enhancement Possibilities]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_enhancement_possibilities
[Data Migration Support]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_data_migration_support
[Document Ownership]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_document_ownership
[Variants]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_variants

<!--- other links ---> 
[Helm A12 Stack charts]: https://docs.geta12.com/docs/?release=2023.06#product:build_and_deployment,artifact:a12-stack,content:asciidoc,scene:Xv9cKv
[A12 Jenkins Deployment Pipelines]: https://docs.geta12.com/docs/?release=2023.06#product:build_and_deployment,artifact:a12-pipelines-doc,content:asciidoc,scene:6w0lCy
[JDK]: https://adoptopenjdk.net/
[Gradle]: https://docs.gradle.org/
[Docker]: https://hub.docker.com/
[Node]: https://nodejs.org/en/docs/
[npm]: https://docs.npmjs.com/about-npm
[npm semver]: https://github.com/npm/node-semver
<!--- End of References --->

# A12 Tutorial Application
An introduction into development with A12, based on Project Template. For more information about the Project Template and how to get started, check out the detailed documentation on [getA12].

## Content
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Documentation](#documentation)
- [Quickstart](#quickstart)
- [Jenkins Pipelines](#jenkins-pipelines)
    - [Overview](#overview)
    - [Pipeline Preparation](#pipeline-preparation)
    - [Creating Job in Jenkins](#creating-job-in-jenkins)

<a name="introduction"></a>
## Introduction
By default, tutorial services are exposed on the following ports:

| Service             | Port      | Note        |
|---------------------|-----------|-------------|
| Frontend            | ``:8081`` |             |
| A12 Tutorial Server | ``:8082`` |             |
| Postgres            | ``:8083`` | Docker only |

<a name="prerequisities"></a>
## Prerequisites
Proper environment setup is crucial for the successful build and run of this project. Please follow the steps in the [environment and tools setup] documentation carefully.

To wrap up, the following [tools](./tool-versions.json) are required to build this project. Versions are maintained in `./tool-versions.json` file and follow [npm semver] versioning patterns.

<!--- VERSION_TABLE_START (Edit versions in tool-versions.json, not here. Do not delete this tag.) --->
| Tool                 | Version      | Note                                                           |
|----------------------|--------------|----------------------------------------------------------------|
| [JDK]                | '17'         |                                                                |
| [Gradle]<sup>1</sup> | '>=7.6.x <8' | Optional, Gradle Wrapper <sup>2</sup> can be used instead.     |
| [Node]               | '18.15.x'    | Optional, Gradle Node plugin <sup>3</sup> can be used instead. |
| [npm]<sup>1</sup>    | '9.5.x'      | Optional, Gradle Node plugin <sup>3</sup> can be used instead. |
| [Docker]<sup>1</sup> | '>=20.x'     |                                                                |
<!--- VERSION_TABLE_END (Edit versions in tool-versions.json, not here. Do not delete this tag.) --->

<sup>1</sup>) These tools have to be configured to use proper Artifactory. Please, follow [Artifactory access] documentation to set it up.  
<sup>2</sup>) [Gradle Wrapper] allows you to skip the Gradle installation. Follow the linked documentation to learn more.  
<sup>3</sup>) [Gradle Node plugin] allows you to skip the Node and npm installation. Follow the linked documentation to learn more.

<a name="documentation"></a>
## Documentation
You can find the details on all topics in the [geta12] Project Template documentation with links to the direct access below:

- **[Environment and Tools Setup]** - Details on setting up Gradle, Node & npm, Docker and Java tools, setting their access to the specific Artifactory and some troubleshooting tips.
- **[Getting Started With the Project]** - Description of the structure of the Project Template content, how to get it and what the most important commands for using it are.
- **[Preparation of the Project Template for a New Project]** - Helps with version control initialization of the project, hints on renaming placeholders and changes inside the project needed for external partners.
- **[Build]** - Detailed steps and variants of building the project modules and related Docker images.
- **[Run]** - Possibilities of running and accessing the application as standalone or in Docker containers.
- **[Development Tips]** - Tips on tools, changes and things to focus on, if you are starting with development, for both frontend and backend.
- **[Testing]** - Describes tools used for testing of the Project Template.
- **[Deployment]** - Briefly describes deployment possibilities. The details of CI/CD Jenkins pipelines are the largest [part of this README document](#jenkins-pipelines).
- **[Enhancement Possibilities]** - Examples of adding your own models and modules.
- **[Data Migration Support]** - Example of a document migration task.
- **[Document Ownership]** - Description of rules and permissions associated with document modification.
- **[Variants]** - Describes variants of the Project Template integrated with A12 products other than Client and Data Services.

<a name="quickstart"></a>
## Quickstart
Assuming you went through the documentation, your environment is set up and project is prepared, this is the most straightforward way to get your project application up and running:

**1. Build the application modules**  
`gradle build`

**2. Run**
1. Run the server application with the default development Spring profile and keep it running:  
   `gradle :server:app:bootrun --args='--spring.profiles.active=dev-env'`
2. Run client
    1. In another terminal window, move to client directory with `cd client`.
    2. Then start the webpack with `npm start` and keep it running.

**3. Explore the application**  
The frontend is, by default, running on http://localhost:8081.

There are three test users with credentials:

- `admin` / `A12-admintest` for Admin role
- `user1` / `A12-user1test` for User role
- `user2` / `A12-user2test` for User role

Log in with one of these credentials and take a look over the content.