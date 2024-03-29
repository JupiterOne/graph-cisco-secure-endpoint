# v2.0.7 (Mon Sep 04 2023)

#### 🐛 Bug Fix

- INT-9221 - fix findings duplicate key [#70](https://github.com/JupiterOne/graph-cisco-secure-endpoint/pull/70) (ronald.arias@contractor.jupiterone.com)

#### Authors: 1

- Ronald Arias ([@RonaldEAM](https://github.com/RonaldEAM))

---

# v2.0.6 (Fri Sep 01 2023)

#### 🐛 Bug Fix

- INT-9221 - fix duplicate endpoint entity error [#69](https://github.com/JupiterOne/graph-cisco-secure-endpoint/pull/69) (ronald.arias@contractor.jupiterone.com)

#### Authors: 1

- Ronald Arias ([@RonaldEAM](https://github.com/RonaldEAM))

---

# v2.0.5 (Wed Aug 30 2023)

#### 🐛 Bug Fix

- INT-9221 - add auto release and adjust workflows [#68](https://github.com/JupiterOne/graph-cisco-secure-endpoint/pull/68) (ronald.arias@contractor.jupiterone.com)
- v2.0.4 [#67](https://github.com/JupiterOne/graph-cisco-secure-endpoint/pull/67) (ronald.arias@contractor.jupiterone.com)

#### Authors: 1

- Ronald Arias ([@RonaldEAM](https://github.com/RonaldEAM))

---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 2.0.4 - 2022-08-28

### Fixed

- Fixed package build

## 2.0.3 - 2022-08-25

### Added

- `questions` workflow
- `jupiterone/questions/questions.yaml`

## 2.0.1 - 2023-08-23

### Changed

- Upgrade SDK packages

## 2.0.0 - 2022-04-20

### Changed

- Project name changed from `@jupiterone/graph-cisco-amp` to
  `@jupiterone/graph-cisco-secure-endpoint`

## 1.0.1 - 2022-04-19

### Fixed

- Fixed `FINDING_IS_VULNERABILITY` constant. `sourceType` is now
  `cisco_amp_finding` and `targetType` is now `cve`.

## 1.0.0 - 2022-04-11

### Added

- Added new findings step creating the following entities and relationships:

  - `cisco_amp_finding`
  - `cisco_amp_vulnerability`
  - `cisco_amp_finding_is_vulnerability`
  - `cisco_amp_endpoint_identified_finding`

- Added `getStepStartStates` which disables the `findings` step by default. To
  enable this step, the IntegrationConfig must have `disableFindingsStep` =
  false.

### Changed

- Client now uses `iterateResources` pattern for all steps.

- Endpoint protects device relationship is now correctly classified as a
  `mappedRelationship`

## 0.7.2 - 2022-03-31

### Changed

- Updated the following dependencies recommended by dependabot. All updates are
  minor version updates:
  - `axios`

## 0.7.1 - 2022-03-30

### Changed

- Updated the following dependencies recommended by dependabot. All updates are
  minor/patch version updates:
  - `aws-sdk`
  - `ajv`
  - `ansi-regex`
  - `node-fetch`
  - `lodash-es`
  - `url-parse`
  - `tmpl`
  - `lodash`
  - `minimist`
  - `follow-redirects`
  - `path-parse`
  - `glob-parent`

## 0.7.0 - 2022-03-30

### Added

- `IntegrationConfig` can now be loaded from `.env`

### Changed

- Upgraded `@jupiterone/integration-sdk-*` to `v8.8.0`

### Fixed

- Fixed error where `mac` and `ip` properties of computer were `trim()`ed when
  possibly `undefined`

## 0.6.0 - 2021-07-12

### Changed

- Upgraded `@jupiterone/integration-sdk-*@6.10.0`

## 0.2.1 - 2020-06-01

### Fixed

- Allow `.` in computer `hostname` property values.

- Add missing `_type` values to step configuration.

- Define `IntegrationConfig` type and add as generic parameter as required.

### Changed

- Upgrade to `@jupiterone/integration-sdk@3.1.0`

## 0.2.0 - 2020-05-31

### Added

- Added `hostname`, `installDate`, `lastSeen` properties to `Computer` entities

- Added mapped `PROTECTS` relationships between agents and their discovered
  `Device`s/`Host`s

### Fixed

- Documentation

## 0.1.2 - 2020-05-15

### Fixed

- `Account` entity created from properties not found on `instance.config`.
