<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.mgm-tp.com/global-content/cd/logos/a12/app-icons/dark/A12-Dark.svg" />
  <img src="https://www.mgm-tp.com/global-content/cd/logos/a12/app-icons/light/A12-Light.svg" height="200" alt="A12 logo" />
</picture>

# Project Template

Use this template to quickstart your A12-based project. For more information about the Project Template and how to get started, check out the detailed documentation on [GetA12].

---

## License

Parts of the A12 platform are made available under a **dual license**.  
Please check the [LICENSE](./LICENSE) file for details.

---

## Getting Started

### How to Build and Run

#### Prerequisites (tools and their versions)

Proper environment setup is crucial for the successful build and run of this project. Please follow the steps in the [environment and tools setup] documentation carefully.

To wrap up, the following [tools](./tool-versions.json) are required to build this project. Versions are maintained in `./tool-versions.json` file and follow [npm semver] versioning patterns.

<!--- VERSION_TABLE_START (Edit versions in tool-versions.json, not here. Do not delete this tag.) --->
| Tool                 | Version      | Note |
|----------------------|--------------|------|
| [JDK]                | '21'         |      |
| [Gradle]<sup>1</sup> | '>=8.5.x <9' |      |
| [Node]               | '22.x.x'     |      |
| [npm]<sup>1</sup>    | '>=10.7.x'   |      |
| [Docker]<sup>1</sup> | '>=20.x'     |      |
| [Docker Compose]     | '>=2.20.3'   |      |
<!--- VERSION_TABLE_END (Edit versions in tool-versions.json, not here. Do not delete this tag.) --->

<sup>1</sup>) These tools have to be configured to use proper Artifactory. Please, follow [Artifactory access] documentation to set it up.

#### How to Build

To build the application modules:

`gradle build`

#### How to Test

Please see [e2e/README.md](./e2e/README.md) for guidelines on how to test the Project Template.

#### How to Run

Assuming you went through the documentation, your environment is set up, project is prepared and the build was successful, you need to do the following to run the application:

1. Project Template application
    1. Compose up the Keycloak container in Docker:
        `gradle keycloakComposeUp`
        > **WARNING**: Project Template's Keycloak setup is for development purposes only. It is necessary to significantly enhance the security of a Keycloak instance for production environments.
    2. Run the server application with the default development Spring profile and keep it running:  
        `gradle :server:app:bootrun --args='--spring.profiles.active=dev-env'`
    3. Run client:
        1. In another terminal window, move to client directory with `cd client`.
        2. Then start the webpack with `npm start` and keep it running.

2. Project Template init application (for initialization and migration purposes)
    > **WARNING**: Before running the init application, make sure to stop the server application first. The init application will lock the Postgres database during initialization, and the database could become inconsistent if data is being initialized while the server is still running.
    - Run the init application with the default development Spring profile:  
        `gradle :server:init:bootrun --args='--spring.profiles.active=dev-env'`
    - Run the init application with the 'init-data' Spring profile additionally to initialize documents based on the `import/data/request` folder:
        `gradle :server:init:bootrun --args='--spring.profiles.active=dev-env,init-data'`  

#### How to Access It

By default, template services are exposed on the following ports:

| Service                 | Port      | Note        |
|-------------------------|-----------|-------------|
| Frontend                | ``:8081`` |             |
| Project Template Server | ``:8082`` |             |
| Postgres                | ``:8083`` | Docker only |
| Keycloak                | ``:8089`` | Docker only |

Once all services are running, you can access the frontend at [http://localhost:8081](http://localhost:8081).

There are three test users with credentials:

- `admin` / `A12PT-admintest` for Admin role
- `user1` / `A12PT-user1test` for User role
- `user2` / `A12PT-user2test` for User role

Log in with one of these credentials and take a look over the content.
> **WARNING**: Project Template's login setup is for development purposes only. It is necessary to significantly enhance the security of logins and user management for production environments.

---

### Documentation

You can find the details on all topics in the [Geta12] Project Template documentation with links to the direct access below:

- **[Downloads]** - List of the Project Template artifacts downloadable in different variants.
- **[Environment and Tools Setup]** - Details on setting up Gradle, Node & npm, Docker and Java tools, setting their access to the specific Artifactory and some troubleshooting tips.
- **[Getting Started With the Project]** - Description of the structure of the Project Template content, how to get it and what the most important commands for using it are.
- **[File Naming Convention]** - Guidelines for naming files consistently across the project.
- **[Preparation of the Project Template for a New Project]** - Helps with version control initialization of the project, hints on renaming placeholders and changes inside the project needed for external partners.
- **[Build]** - Detailed steps and variants of building the project modules and related Docker images.
- **[Run]** - Possibilities of running and accessing the application as standalone or in Docker containers.
- **[Development Tips]** - Tips on tools, changes and things to focus on, if you are starting with development, for both frontend and backend.
- **[Connecting to Databases]** - Tips on how to connect to databases.
- **[CI/CD]** - Briefly describes the continuous integration and deployment possibilities.
- **[Security]** - Tips for security enhancements of the Project Template.
- **[Enhancement Possibilities]** - Examples of adding your own models and modules.
- **[Working With the SME]** - Describes tools used for modeling and testing of the Project Template.
- **[Data Migration Support]** - Example of a document migration task.
- **[Document Ownership]** - Description of rules and permissions associated with document modification.
- **[End-to-End Testing]** - Description of End-to-End Test setup, how to test your application using Playwright.
- **[Configuration]** - Detailed description of the configuration profiles and other configuration-related files used in the Project Template.
- **[Localization]** - Describes the localization setup and how to adjust it.
- **[Variants]** - Describes variants of the Project Template integrated with A12 products other than Client and Data Services.

- The website also provides access to the **A12 Discourse Community Forum**.

---

**The mgm A12 Team**

[mgm technology partners GmbH](https://www.mgm-tp.com) • [Imprint](https://www.mgm-tp.com/imprint.html)

---

<!--- References ---
<!--- Project Template GetA12 documentation links --->
[GetA12]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM
[Artifactory access]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_gradle_configuration
[Downloads]: https://docs.geta12.com/docs/#content:asciidoc,product:project_template,artifact:project-template-documentation,scene:Qc5TNM,anchor:_downloads
[Environment and Tools Setup]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_environment_and_tools_setup
[Getting Started With the Project]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_getting_started_with_the_project
[File Naming Convention]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_file_naming_convention
[Preparation of the Project Template for a New Project]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_preparation_of_the_project_template_for_a_new_project
[Build]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_build
[Run]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_run
[Development Tips]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_development_tips
[Connecting to Databases]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_connecting_to_databases
[CI/CD]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_cicd
[Security]: https://docs.geta12.com/docs/#content:asciidoc,product:project_template,artifact:project-template-documentation,scene:Qc5TNM,anchor:_security
[Enhancement Possibilities]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_enhancement_possibilities
[Working With the SME]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_working_with_the_sme
[Data Migration Support]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_data_migration_support
[Document Ownership]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_document_ownership
[End-to-End Testing]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_end_to_end_testing
[Configuration]: https://docs.geta12.com/docs/#content:asciidoc,product:project_template,artifact:project-template-documentation,scene:Qc5TNM,anchor:configuration_profiles
[Localization]: https://docs.geta12.com/docs/#content:asciidoc,product:project_template,artifact:project-template-documentation,scene:Qc5TNM,anchor:_localization
[Variants]: https://docs.geta12.com/docs/#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_variants

<!--- other links --->
[JDK]: https://adoptopenjdk.net/
[Gradle]: https://docs.gradle.org/
[Docker]: https://hub.docker.com/
[Node]: https://nodejs.org/en/docs/
[npm]: https://docs.npmjs.com/about-npm
[npm semver]: https://github.com/npm/node-semver
<!--- End of References --->
