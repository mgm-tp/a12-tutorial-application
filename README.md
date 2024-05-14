<!--- References --->
<!--- Project Template getA12 documentation links --->
[getA12]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM
[Artifactory access]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_artifactory_access
[Gradle Wrapper]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_gradle_wrapper
[Gradle Node plugin]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_gradle_node_plugin
[Environment and Tools Setup]: https://docs.geta12.com/docs/?release=2023.06#content:asciidoc,product:PROJECT_TEMPLATE,artifact:project-template-documentation,scene:Qc5TNM,anchor:_environment_and_tools_setup

<!--- other links --->
[JDK]: https://adoptopenjdk.net/
[Gradle]: https://docs.gradle.org/
[Docker]: https://hub.docker.com/
[Node]: https://nodejs.org/en/docs/
[npm]: https://docs.npmjs.com/about-npm
[npm semver]: https://github.com/npm/node-semver
<!--- End of References --->

# A12 Tutorial Application
An introduction into development with A12, based on the Project Template. For more information about the Project Template and how to get started, check out the detailed documentation on [getA12].

## Content
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)

<a name="introduction"></a>
## Introduction
By default, A12 Tutorial services are exposed on the following ports:

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
| [JDK]                | '17/21'      |                                                                |
| [Gradle]<sup>1</sup> | '>=8.5.x <9' | Optional. Gradle Wrapper <sup>2</sup> can be used instead.     |
| [Node]               | '18.15.x'    | Optional. Gradle node plugin <sup>3</sup> can be used instead. |
| [npm]<sup>1</sup>    | '9.5.x'      | Optional. Gradle node plugin <sup>3</sup> can be used instead. |
| [Docker]<sup>1</sup> | '>=20.x'     |                                                                |
<!--- VERSION_TABLE_END (Edit versions in tool-versions.json, not here. Do not delete this tag.) --->

<sup>1</sup>) These tools have to be configured to use proper Artifactory. Please, follow [Artifactory access] documentation to set it up.  
<sup>2</sup>) [Gradle Wrapper] allows you to skip the Gradle installation. Follow the linked documentation to learn more.  
<sup>3</sup>) [Gradle Node plugin] allows you to skip the Node and npm installation. Follow the linked documentation to learn more.

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

- `admin` / `A12PT-admintest` for Admin role
- `user1` / `A12PT-user1test` for User role
- `user2` / `A12PT-user2test` for User role

Log in with one of these credentials and take a look over the content.