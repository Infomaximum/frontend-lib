# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [Unreleased]

### Features

- контекст привязанного пространства (`workspaceContext`) и типы API ресурсов [MS-932]

## 1.2.0


### Features

* типизированы пропсы кастомного приложения: добавлены `IApplicationRouteApi`, `IApplicationProps`; `IApplication.mount`/`update` используют `IApplicationProps` вместо `Record<string, any>`

## 1.1.0 (2023-07-07)


### Features

* добавлена команда сборки библиотек в монорепозитории
* добавлено поле язык системы в пропсах компонента
* добавлены библиотеки типов
