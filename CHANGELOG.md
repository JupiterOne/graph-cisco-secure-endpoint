# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 0.2.1 - 2020-06-01

### Fixed

- Allow `.` in computer `hostname` property values.

- Add missing `_type` values to step configuration.

- Define `IntegrationConfig` type and add as generic parameter as required.

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
