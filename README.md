# orchy-core

[![orchy-core CI](https://github.com/orchy-mfe/orchy-core/actions/workflows/pipeline.yml/badge.svg)](https://github.com/orchy-mfe/orchy-core/actions/workflows/pipeline.yml)

Welcome to the `orchy-core` repository, the main one of the `Orchy Project`.  

It is a monorepo which includes the following packages:
- @orchy-mfe/back-end: a Fastify backend that can be used to serve orchy's configuration files;
- @orchy-mfe/models: includes the TypeScript models for the orchy's configurations and the Micro Frontends properties;
- @orchy-mfe/page-builder: the library which enables the Server Driven UI;
- @orchy-mfe/web-component: the Web Component which embeds the orchestration logics.


In the root level `package.json` are defined the scripts to:
- easily access each package (the one prefixed with `w:`):
- `orchy` development (`build`, `lint`...).

# Contributing

Every contribution is always welcome.

Please, be aware to **always**:
- test what you write;
- update accordingly the [documentation](https://github.com/orchy-mfe/orchy-doc) with your changes.

# Project documentation

You can read the full project documentation [here](https://orchy-mfe.github.io/).