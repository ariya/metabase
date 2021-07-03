# Development Environment

If you plan to work on the Metabase code and make changes then you'll need to understand a few more things.

## Overview

The Metabase application has two basic components:

1. a backend written in Clojure which contains a REST API as well as all the relevant code for talking to databases and processing queries.
2. a frontend written as a Javascript single-page application which provides the web UI.

Both components are built and assembled together into a single jar file which runs the entire application.

## 3rd party dependencies

Metabase depends on lots of other 3rd party libraries to run, so as you are developing you'll need to keep those up to date. Leiningen will automatically fetch Clojure dependencies when needed, but for JavaScript dependencies you'll need to kick off the installation process manually when needed.

```sh
# javascript dependencies
$ yarn
```

## Development server (quick start)

Run your backend development server with

    lein run

Start the frontend build process with

    yarn build-hot

## Frontend development

We use these technologies for our FE build process to allow us to use modules, es6 syntax, and css variables.

- webpack
- babel
- cssnext

Frontend tasks are executed using `yarn`. All available tasks can be found in `package.json` under _scripts_.

To build the frontend client without watching for changes, you can use:

```sh
$ yarn build
```

If you're working on the frontend directly, you'll most likely want to reload changes on save, and in the case of React components, do so while maintaining state. To start a build with hot reloading, use:

```sh
$ yarn build-hot
```

Note that at this time if you change CSS variables, those changes will only be picked up when a build is restarted.

There is also an option to reload changes on save without hot reloading if you prefer that.

```sh
$ yarn build-watch
```

Some systems may have trouble detecting changes to frontend files. You can enable filesystem polling by uncommenting the `watchOptions` clause in `webpack.config.js`. If you do this it may be worth making git ignore changes to webpack config, using `git update-index --assume-unchanged webpack.config.js`

### Frontend testing

All frontend tests are located in `frontend/test` directory. Run all frontend tests with

```
yarn test
```

which will run unit and Cypress end-to-end tests in sequence.

### Cypress end-to-end tests

End-to-end tests simulate realistic sequences of user interactions. Read more about how we approach end-to-end testing with Cypress in our [wiki page](https://github.com/metabase/metabase/wiki/E2E-Tests-with-Cypress).

Cypress end-to-end tests use an enforced file naming convention `<test-suite-name>.cy.spec.js` to separate them from unit tests.

### Jest unit tests

Unit tests are focused around isolated parts of business logic.

Unit tests use an enforced file naming convention `<test-suite-name>.unit.spec.js` to separate them from end-to-end tests.

```
yarn test-unit # Run all tests at once
yarn test-unit-watch # Watch for file changes
```

## Backend development

Leiningen and your REPL are the main development tools for the backend. There are some directions below on how to setup your REPL for easier development.

And of course your Jetty development server is available via

    lein run

### Building drivers

Most of the drivers Metabase uses to connect to external data warehouse databases are separate Leiningen projects under the `modules/` subdirectory. When running Metabase via `lein`, you'll
need to build these drivers in order to have access to them. You can build drivers as follows:

```
# Build the 'mongo' driver
./bin/build-driver.sh mongo
```

(or)

```
# Build all drivers
./bin/build-drivers.sh
```

The first time you build a driver, it will be a bit slow, because Metabase needs to build the core project a couple of times so the driver can use it as a dependency; you can take comfort in the
fact that you won't need to build the driver again after that. Alternatively, running Metabase 1.0+ from the uberjar will unpack all of the pre-built drivers into your plugins directory; you can
do this instead if you already have a Metabase uberjar (just make sure `plugins` is in the root directory of the Metabase source, i.e. the same directory as `project.clj`).

### Including driver source paths for development or other Leiningen tasks

For development when running various Leiningen tasks you can add the `include-all-drivers` profile to merge the drivers' dependencies and source paths into the Metabase
project:

```
# Install dependencies
lein with-profiles +include-all-drivers deps
```

This profile is added by default when running `lein repl`, tests, and linters.

#### Unit Tests / Linting

Run unit tests with

    lein test

or a specific test with

    lein test metabase.api.session-test

By default, the tests only run against the `h2` driver. You can specify which drivers to run tests against with the env var `DRIVERS`:

    DRIVERS=h2,postgres,mysql,mongo lein test

Some drivers require additional environment variables when testing since they are impossible to run locally (such as Redshift and Bigquery). The tests will fail on launch and let you know what parameters to supply if needed.

##### Run the linters:

    lein eastwood && lein bikeshed && lein docstring-checker && lein check-namespace-decls && ./bin/reflection-linter

#### Developing with Emacs

`.dir-locals.el` contains some Emacs Lisp that tells `clojure-mode` how to indent Metabase macros and which arguments are docstrings. Whenever this file is updated,
Emacs will ask you if the code is safe to load. You can answer `!` to save it as safe.

By default, Emacs will insert this code as a customization at the bottom of your `init.el`.
You'll probably want to tell Emacs to store customizations in a different file. Add the following to your `init.el`:

```emacs-lisp
(setq custom-file (concat user-emacs-directory ".custom.el")) ; tell Customize to save customizations to ~/.emacs.d/.custom.el
(ignore-errors                                                ; load customizations from ~/.emacs.d/.custom.el
  (load-file custom-file))
```
