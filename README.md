![A12](./A12_logo.png)

# A12 Tutorial Application
A12 is an Enterprise Low Code Platform developed by [mgm-tp]. To be able to work with it, you need access to [getA12.com]. You can get it by reaching out to [mgm-tp].

A12 Tutorial Application is an introduction into development with A12, based on the Project Template. For more information about the Project Template and how to get started, check out the detailed documentation on [getA12].

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
<!--- VERSION_TABLE_END (Edit versions in tool-versions.json, not here. Do not delete this tag.) --->

<sup>1</sup>) These tools have to be configured to use proper Artifactory. Please, follow the [Artifactory access] documentation to set it up.

#### How to Build

To build the application modules:

`gradle build`

#### How to Run

Assuming you went through the documentation, your environment is set up, project is prepared and the build was successful, you need to do the following to run the application:

1. Project Template application
   1. Run the server application with the default development Spring profile and keep it running:  
      `gradle :server:app:bootrun --args='--spring.profiles.active=dev-env'`
       > **NOTE**: It is normal for the server startup progress to not quite reach 100% in the terminal output. Once you see the progress indicator hit around 80% or higher without any error logs, the server is running properly.
   2. Run client:
       1. In another terminal window, move to client directory with `cd client`.
       2. Then start the webpack with `npm start` and keep it running.
2. Project Template init application (for initialization and migration purposes)
    > **WARNING**: Before running the init application, make sure to stop the server application first. The init application will lock the Postgres database during initialization, and the database could become inconsistent if data is being initialized while the server is still running.
    - Run the init application with the default development Spring profile:  
        `gradle :server:init:bootrun --args='--spring.profiles.active=dev-env'`
    - Run the init application with the 'init-data' Spring profile additionally to initialize documents based on the `import/data/request` folder:
        `gradle :server:init:bootrun --args='--spring.profiles.active=dev-env,init-data'`  

#### How to Access It

By default, A12 Tutorial services are exposed on the following ports:

| Service                 | Port      | Note        |
|-------------------------|-----------|-------------|
| Frontend                | ``:8081`` |             |
| Project Template Server | ``:8082`` |             |
| Postgres                | ``:8083`` | Docker only |

Once all services are running, you can access the frontend at [http://localhost:8081](http://localhost:8081).

There are three test users with credentials:

- `admin` / `A12PT-admintest` for Admin role
- `user1` / `A12PT-user1test` for User role
- `user2` / `A12PT-user2test` for User role

Log in with one of these credentials and take a look over the content.

---

**The mgm A12 Team**

[mgm technology partners GmbH](https://www.mgm-tp.com) • [Imprint](https://www.mgm-tp.com/imprint.html)

---

Copyright (c) 2025 mgm technology partners GmbH

<!--- References --->
<!--- A12 Tutorial getA12 documentation links --->
[getA12]: https://geta12.com/#/docs/2025.06/ext4/project_template/project-template-documentation
[Artifactory access]: https://geta12.com/#/docs/2025.06/ext4/project_template/project-template-documentation%23_artifactories
[Environment and Tools Setup]: https://geta12.com/#/docs/2025.06/ext4/project_template/project-template-documentation%23_environment_and_tools_setup
[mgm-tp]: https://mgm-tp.com
[getA12.com]: https://geta12.com

<!--- other links --->
[JDK]: https://adoptopenjdk.net/
[Gradle]: https://docs.gradle.org/
[Docker]: https://hub.docker.com/
[Docker Compose]: https://docs.docker.com/compose/
[Node]: https://nodejs.org/en/docs/
[npm]: https://docs.npmjs.com/about-npm
[npm semver]: https://github.com/npm/node-semver
<!--- End of References --->
