# dockstore-ui
[![Build Status](https://travis-ci.org/ga4gh/dockstore-ui.svg?branch=develop)](https://travis-ci.org/ga4gh/dockstore-ui)
[![Coverage Status](https://coveralls.io/repos/github/ga4gh/dockstore-ui/badge.svg?branch=develop)](https://coveralls.io/github/ga4gh/dockstore-ui?branch=develop)

This is an AngularJS UI for the Dockstore [Web Service](https://github.com/ga4gh/dockstore).

The Dockstore brings together tools in Docker images with CWL-based descriptors.  We hope to use this project as motivation to create a GA4GH API standard for container registries and intend on making Dockstore fully compliant.

Code documentation for the UI is available at https://ga4gh.github.io/dockstore-ui/#/api

Please file issues for this repository and Web site at [the ga4gh/dockstore repository](https://github.com/ga4gh/dockstore/issues)!

### Configuration Parameters

All configuration settings for the Web UI is done in the `app/scripts/services/webservice.js` file. This file is compiled along with the rest of the application, it must be set before running `grunt`.

Replace <LOCAL_IP_ADDRESS> with the workstation's IP address in the LAN, if `localhost` is used, Bitbucket authentication will fail due to browser redirection domain security policies.

1. For development, the server name should be `http://<LOCAL_IP_ADDRESS>:9000`, on a production environment, replace this URI with a fully-qualified domain name (e.g. `https://www.dockstore.org:8443`).
  ```
  API_URI: 'http://<LOCAL_IP_ADDRESS>:8080',
  API_URI_DEBUG: 'http://<LOCAL_IP_ADDRESS>:8090/tests/dummy-data',
  ```

2. Replace `GITHUB_CLIENT_ID` with the client id for your GitHub Dockstore application.
  ```
  GITHUB_AUTH_URL: 'https://github.com/login/oauth/authorize',
  GITHUB_CLIENT_ID: '<GITHUB_DEV_APPLICATION_CLIENT_ID>',
  GITHUB_REDIRECT_URI: 'http://<LOCAL_IP_ADDRESS>:9000/login',
  GITHUB_SCOPE: 'read:org',
  ```

3. Replace `QUAYIO_CLIENT_ID` with the client id for your Quay.io Dockstore application. Use `http://<LOCAL_IP_ADDRESS>:9000` only for development.
  ```
  QUAYIO_AUTH_URL: 'https://quay.io/oauth/authorize',
  QUAYIO_CLIENT_ID: '<GITHUB_QUAY_IO_APPLICATION_CLIENT_ID>',
  QUAYIO_REDIRECT_URI: 'http://<LOCAL_IP_ADDRESS>:9000/auth/quay.io',
  QUAYIO_SCOPE: 'repo:read,user:read'
  ```

3. Replace `BITBUCKET_CLIENT_ID` with the client id for your Bitbucket Dockstore application.
  ```
  BITBUCKET_AUTH_URL: 'https://bitbucket.org/site/oauth2/authorize',
  BITBUCKET_CLIENT_ID: '<BITBUCKET_DEV_APPLICATION_CLIENT_ID>,
  ```

### Third-Party API Integration

Dockstore currently integrates with GitHub and Quay.io, in the following steps, replace `http://<LOCAL_IP_ADDRESS>:9000` with a fully-qualified domain name on a production environment.

1. On GitHub, create an application and enter the following for `Authorization callback URL`: `http://<LOCAL_IP_ADDRESS>:9000/login`.
2. On Quay.io, create an application and enter the following for `Redirect/Callback URL Prefix`: `http://<LOCAL_IP_ADDRESS>:9000/auth/quay.io`.
3. On Bitbucket, create an application and enter the following for `Callback URL`: `http://<LOCAL_IP_ADDRESS>:9000/auth/bitbucket.org`. Due to security policies, it may be necessary to bind the application to a local IP address or FQDN rather than `localhost`, or else the Bitbucket will not redirect back to Dockstore properly.

### Setting Up the Build Environment

1. Install [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) on your workstation, specific instructions will vary depending on the operating system distribution. The use of [nvm](https://github.com/creationix/nvm) is encouraged in supported environments. On Mac OS X, [`brew`](http://brew.sh/) may alternatively be used to install Node.js.

2. Install the principal build dependencies globally:

  ```
  npm install --global grunt-cli bower yo generator-karma generator-angular toaster
  ```

3. Install Compass, on Ubuntu 14.04 LTS run (use brew on Mac OS X):

  ```
  sudo apt-get install -y ruby ruby-dev
  gem install compass
  ```

4. In a workspace directory (e.g. ~/workspace/ga4gh/), clone the `dockstore-ui` repository from GitHub:

  ```
  git clone --recursive 'https://github.com/ga4gh/dockstore-ui.git'
  ```

5. Update the NPM and Bower packages as described in the project's configuration files:

  ```
  npm update
  bower update
  ```

6. Attempt to build the project by running: `grunt` from the root directory of the `dockstore-ui` repository. On Mac OS X, use NPM to install any missing dependencies indicated by the output of the build tool until it succeeds (it may be necessary to install some packages locally).

7. Run `grunt serve` to open the UI on a web browser, the page will automatically reload or recompile the SASS stylesheets whenever a file changes or is added in the project directory. If you receive an error message about too many open files, increase the watch limit with:

  ```
  sysctl -w kern.maxfiles=20480
  ```

### Running the Dockstore UI (Development)

1. The Dockstore web service and database should be running, and the API accessible on `http://<LOCAL_IP_ADDRESS>:8080`.
2. All the configuration in the JavaScript and on GitHub/Quay.io should be set to use `http://<LOCAL_IP_ADDRESS>:9000`.
3. In the dockstore-ui repository root directory, run `grunt serve`.
4. You should be automatically navigated to `http://<LOCAL_IP_ADDRESS>:9000` in a web browser. (You may also be navigated to `http://0.0.0.0:9000` instead, which may not necessarily work depending on your setup). 

### Deploying the Dockstore UI (Staging)
1. The Dockstore web service and database should be running.
2. `cd` into the dockstore-ui directory.
3. `git branch` to check that you are on the right branch (should be develop)
4. `git pull` to pull changes from Github.
5. `nvm use stable` to ensure you are using the latest stable version of Node.
6. `grunt` to run (must be done from the dockstore-ui dir!)
7. `sudo service nginx restart` to restart nginx service.

### Deploying the Dockstore UI (Production)
1. The Dockstore web service and database should be running, and the API accessible on `https://www.dockstore.org:8080` (the API may use a different server name if desired).
2. All the configuration in the JavaScript and on GitHub/Quay.io should be set to use `https://www.dockstore.org/`.
3. In the dockstore-ui repository root directory, run `grunt` to build the project, this will execute unit tests, compile all the HTML templates and JavaScript source files, and copy over all the required dependencies.
4. Copy the contents of the `dockstore-ui/dist` folder to the root directory of your web server (e.g. NGINX, Apache, AWS S3, ...).
5. Navigate to `https://www.dockstore.org/` in your web browser.

### Code Structure and Coding Practices

Dockstore UI is a single-page application written in AngularJS, the source code repository structure was created using [Yeoman](http://yeoman.io/)'s [`generator-angular`](https://github.com/yeoman/generator-angular) scaffolding template. The JavaScript source files are currently separated by type as follows:

* Views (HTML for Pages): `/app/views/`
* Services: `/app/scripts/services`
* Controllers (for Pages and Directives): `/app/scripts/controllers`
* Directives: `/app/scripts/directives`
* Templates (HTML for Directives): `/app/templates`
* Filters: `/app/scripts/filters`
* Tests: `/test` (most are disabled due to ongoing refactoring efforts)

The main application module `dockstore.ui` is defined in `/app/scripts/app.js`, routes and module configuration is also done in this file.

It should be noted that this is an inefficient way of storing source files, and that the code should eventually be distributed to directories as [logical submodules](https://scotch.io/tutorials/angularjs-best-practices-directory-structure) (<sup>e.g.</sup> for a directive; a folder would contain the directive, its controller, the template file, etc...).

#### Use of AngularJS Events

Each page in Dockstore UI is composed of directives (which may themselves be composed of nested directives), a control in a directive may affect the state/model of ancestor and/or sibling directives. To efficiently and easily manage these changes, AngularJS events should be used to update models when they are part of complex objects (using [$emit](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [$broadcast](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast) and [$on](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on)).

#### CSS and Stylesheets

Stylesheets for Dockstore UI can be found in `/app/styles/`, these [SCSS](http://sass-lang.com/) (backwards-compatible w/ CSS) files are compiled whenever they are saved as defined in the Grunt script.

* `main.scss`: the original stylesheet that came with the Dockstore UI template (w/ some changes)
* `ds-style-fix.scss`: a 'stop-gap' stylesheet to suppress the anarchy of official Bootstrap stylesheets and `main.css` being loaded into the same document. New styles are appended to this file.

These files (>1000 LoC) should, of course, eventually be merged or refactored into multiple stylesheets. To do that however, the HTML5-AngularJS views and templates need first be heavily refactored/re-written to follow consistent class naming conventions and patterns.

#### Adding Documentation

Documents written in Markdown should be placed in the `app/docs/` directory, they will be visible from the Documentation page in UI after adding an object like this to the `docObjs` array in `app/scripts/services/documentationservice.js`:
```
{
  slug: 'getting-started',
  name: 'Getting Started',
  path: 'docs/getting-started.md'
}
```
Additionally, ngdocs documentation can be viewed from the [Dockstore-ui Github Page](https://ga4gh.github.io/dockstore-ui)

### Resources

+ [Getting Started with Grunt](http://blog.teamtreehouse.com/getting-started-with-grunt)
