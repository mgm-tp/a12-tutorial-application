# Changelog
## [202506.2.0] - 2025-10-28
### Changed
- Updated to Spring Boot 3.5.5
- Added integration for typed accessor classes generation
- Added support for dynamic Content Engine
- Added support for custom theming on client-side

### Fixed
- Moved the authorization resources `roles.yaml` and `childAuthorizationDefinition.json` to the `import/auth` folder to align with SME folder structure

## [202506.1.0] - 2025-08-29
### Changed
- Updated to A12 2025.06-ext1
- Updated to Spring Boot 3.5.4
- Updated to Keycloak 26.3.0
- Updated to Postgres 16.2
- Adjusted CORS configuration for development to simplify the SME model deployment

### Fixed
- Cleaned up unnecessary npm dependencies
- Increased HTTP header size

## [202506.0.0] - 2025-07-02
### Changed
- Upgrade to A12 2025.06
- Introduced support for Seed-Data and its deployment via SME
- Content Engine is integrated out-of-the-box
- Removed support for JDK 17

## [202406.6.0] - 2025-06-25
### Changed
- Switch to 'base-bundle' instead of A12AlignmentRule
- Updated to A12 2024.06-ext6
- Updated to Spring Boot 3.4.5

## [202406.5.0] - 2025-04-22
### Changed
- Switched from 'event_delete' to 'delete' event names
- Introduced Gradle dependency locking with `gradle.lockfile` for 'server/app' and 'server/init' modules

### Fixed
- Added 'a12internal' to ESLint and Checkstyle import control as an unallowed import source

### [202406.4.0] - 2025-02-24
### Changed
- Introduced MODEL_MANAGE Access Right for the admin user
- Switched to new UAA Roles Selector to retrieve permissions and handling them
- Introduced the new UAA Authorization Introspector library
- Improved the TypeScript compile performance by introducing the 'noEmit' option
- Updated Spring Boot to v3.4.1

### Fixed
- Removed unnecessary _setLanguageSelectedInLoginForm_ saga and related action
- Removed deprecated static page extension usage of Client

## [202406.3.0] - 2024-12-16 
### Changed
- Migrated to ESlint v9 and enhanced linter rules
- Updated Spring Boot to v3.3.6
- Adjusted logging with logback and introduce dev and prod configuration
- Refactored the Docker Compose configuration
- Introduced reloading of UAA authorization rules during runtime (requires a new "systemAdmin" user)
- Added support for 'PARTIAL_MODIFY_DOCUMENT' RPC operation and switched to group operations
- Introduced configuration cache option for Gradle build

### Fixed
- Removed deprecated buildDir property in Gradle build

## [202406.2.0] - 2024-10-25
### Changed
- Removed 3rd party tools options - Gradle Wrapper, Node/npm download and Paketo build 
- Added support for Excel Export
- Switched from h2-in-mem to h2-in-file
- Added persistence for Keycloak realm configuration changes when restarting
- Added coverage of init/app, Camunda, and Notification Center placeholders to 'replacePlaceholders' task
- Attachment content is now per default stored in the content store
- Introduced new Gradle task 'checkstyleFix'
- Introduced Logback for server log handling

### Fixed
- Configured Gradle to correctly support JDK 17 OR JDK 21 for compiling
- Updated recommended Node and NPM version to avoid warnings

## [202406.1.0] - 2024-08-20
### Changed
- Upgrade to 2024.06-ext1
- Switched to H2 file as database configuration by default
- Keycloak uses the Postgres in compose setup
- Added documentation for init app usage

### Fixed
- Extended and refactored 'replacePlaceHolders' task

## [202406.0.0] - 2024-07-15
### Changed
- Upgrade to 2024.06
- Support for AppModel permission handling
- Easier integration of SME workspaces
- Introduce run/debug configuration for Visual Studio Code
- Tree Engine, CDM & Relationship are integrated out-of-the-box

### Fixed
- Enhance Apple Silicon recognition for building docker images 
- Apply new standard Model Naming guideline 
- Enhance Local database profile to be compatible with the docker compose Postgres setup 
- Migration tasks are moved to server/init for DataServices best practice

## [202306.6.0] - 2024-04-25

### Changed
- Upgrade to 2023.06-ext6
- Applied Docker Security rules and suggestion for dockerfiles from A12
- Added module 'permissions' support from App Models
- Switched to 'newModelLoader'-API from A12 Client
- Changed 'gradle :client:start' task which executes ':client:stop' now first
- Introduced 'quality/checkstyle.xml' file with 'checkStyleMain' task now being included in 'test' task
- Added an authorization check and MIME type validation for uploading attachments

### Fixed
- Fixed an issue with the 'replacePlaceholders' task which did not apply the change to "serverPackage" properly
- Fixed an issue with the UAA token refresh which lead to a 'MODIFY_OIDC_USER_FAILED' error
- Removed unused 'formengine' dependency from the server

## [202306.5.0] - 2024-02-20

### Changed
- Added proper docker image labels
- Replaced 'redux-saga' with 'typed-redux-saga' and added ESLint rules
- Updated Spring Boot to v3.1.6

### Fixed
- Fixed an issue with the Keycloak realm configuration which broke the SME Model Deployment to the server

## [202306.4.0] - 2023-12-27

### Changed
- Upgrade to 2023.06-ext4
- Added document ownership, introducing new users
- Changed Keycloak realm and credentials of users
- Introduced new spring profile 'prod' containing production-ready configuration
- Added proper names for docker containers based on the project name
- Added new variants of the Project Template (CDM, Notification-Center)
- Introduced a script to generate certificate files for Workflows and Notification-Center variants

### Fixed
- Fixed an issue with 'replacePlaceholders' task which did not change the group name properly

## [202306.3.0] - 2023-10-24

### Changed
- Upgrade to 2023.06-ext3
- Added document data migration sample
- Added IntelliJ run configuration for ProjectTemplateServerApplication
- Added new gradle task **buildImagesComposeUp**
- Refactored docker compose module

### Fixed
- Fix issues with Keycloak redirecting

## [202306.2.0] - 2023-09-07

### Changed
- Upgrade to 2023.06-ext2
- Added option to skip validation of ESLint and Prettier

## [202306.1.0] - 2023-08-14

### Changed
- Upgrade to 2023.06-ext1
- Upgrade Keycloak to 22
- Upgrade Postgres to 15
- Added Spring layer index approach for building docker images as default (besides Paketo option)
- Introduce a new chapter `Variants` to the document

## [202306.0.0] - 2023-06-29

### Changed
- Upgrade to 2023.06
- Upgrade to Spring Boot v3.1.0, Spring v6.0.9
- Added Locale chooser
- Added version checking for node/npm
- Added replace placeholders of template names

## [202302.1.0] - 2023-05-25

### Changed
- Upgrade to Java 17
- Upgrade to 2023.02-ext1

## [202302.0.0] - 2023-03-03

### Removed
- Workflows & Camunda service

### Changed
- Upgrade to 2023.02
- Upgrade to Nodejs 18 & Npm 8
- Update Jenkins configuration to new a12-jenkins
- Use jsonRpc for importing data on startup instead of deprecated document import

## [202206.4.0] - 2023-01-05

### Changed
- Upgrade to 2022.06-ext5

## [202206.3.0] - 2022-12-20

### Changed
- Use Keycloak as default auth provider
- New service ports:
  - Project Template Server: ~~9090~~ -> 8082
  - Postgres: ~~5433~~ -> 8083


## [202206.2.2] - 2022-10-28

### Changed
- Remove palantir git plugin

## [202206.2.1] - 2022-10-28

### Changed
- Upgrade DS version to 34.2.1

## [202206.2.0] - 2022-10-26

### Changed
- Upgrade to 2022.06-ext4
- Update a12 dependencies
- Update models
- Update Typescript ^4.7.4
- Update Webpack ^5.74.0

## [202206.1.0] - 2022-08-05

### Changed
- Upgrade to 2022.06-ext1

## [202206.0.0] - 2022-06-29

### Added
- PT is now deployed and distributed as an artifact `@com.mgmtp.a12.projecttemplate/project-template`

### Changed
- Versioning follows sematic versioning
- Update a12 dependencies (2022.06)
- Replace stylus (Widgets now supports styled-components)
- Update Localizations

### Security
- Fix npm audit

### Removed
- Remove utils-virtual-bom from gradle builds

## [2022.02] - 2022-03-01

### Changed

- Update a12 dependencies (2022.02)
- Update to React 17

## [2021.06-ext6] - 2022-02-03

### Changed

- Update Typescript ^4.5.5
- Update Webpack ^5.56
- Update a12 dependencies (2021.06-ext6)
- Update non-a12 dependencies
- Rename models
- Remove gradle wrapper
- Change fronted port 5000 -> **8081**

### Fixed

- Permission for MainMenu

### Security

- Fix npm audit

## [2021.06-ext3] - 2021-11-08

### Changed

- Upgrade to 2021.06-ext3
- Update A12 Devtools

### Added

- Client tests
- A12 responsive behavior context

### Fixed

- Appmodel locales
- Document import

## [2021.06-ext1] - 2021-09-20

### Changed

- Upgrade to 2021.06
- Change module order
- Use ranges for a12 dependencies
- Initial activity from model
- Split webpack configuration

### Added

- Use A12 prettier

### Fixed

- Workflows Select process view issue
- Relaod leads to new login

## [2021.02] - 2021-06-23

### Added

- Builder instead of dockerfiles for template
- Initial setup and configurations
