# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0-rc.0](https://github.com/Infomaximum/frontend-lib/compare/v1.1.1...v1.3.0-rc.0) (2026-06-23)


### Features

* добавление скрипта для сборки и обновление зависимости standard-version ([1b9d8cc](https://github.com/Infomaximum/frontend-lib/commit/1b9d8cc9d84defa41a3cc14f8b6341bcc4f79209))
* добавление типизированных пропсов для кастомного приложения ([f3a6913](https://github.com/Infomaximum/frontend-lib/commit/f3a6913948005ca4e84a435ef9f8686f52493c16))
* добавлены интерфейсы для приложений ([225bfe5](https://github.com/Infomaximum/frontend-lib/commit/225bfe55c75858607bc3e44e3d88da8ee2f927f0))
* обновление версии до 1.2.0 и добавление CHANGELOG ([e2ca124](https://github.com/Infomaximum/frontend-lib/commit/e2ca1246f20a9af8ec7ca6c45def29b588b135c1))

## 1.2.0


### Features

* типизированы пропсы кастомного приложения: добавлены `IApplicationRouteApi`, `IApplicationProps`; `IApplication.mount`/`update` используют `IApplicationProps` вместо `Record<string, any>`

## 1.1.0 (2023-07-07)


### Features

* добавлена команда сборки библиотек в монорепозитории
* добавлено поле язык системы в пропсах компонента
* добавлены библиотеки типов
