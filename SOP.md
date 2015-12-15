# Dockstore Standard Operating Procedures

### Dockstore Components

The Dockstore project consists of three major components, the `dockstore-webservice`, the `dockstore-client` and the `dockstore-ui`.

#### dockstore-webservice

&nbsp; | dockstore-webservice
--- | ---
Project Link | [GitHub](https://github.com/ga4gh/dockstore)
Maintainers | [denis-yuen](https://github.com/denis-yuen)
Description | The central REST API providing all the functions of Dockstore, including user accounts and token-based authentication, Docker image registration, synchronization and management, and publication controls. It is written in Java 8 using the [Dropwizard Framework](http://www.dropwizard.io/) for the REST API and [Swagger](http://swagger.io/) for endpoint documentation/interactive testing.
URLs | [swagger-ui](http://localhost:8080/static/swagger-ui/index.html) on localhost

#### dockstore-client

&nbsp; | dockstore-client
--- | ---
Project Link | [GitHub](https://github.com/ga4gh/dockstore)
Maintainers | [denis-yuen](https://github.com/denis-yuen)
Description | A command line interface client for the `dockstore-webservice`, supported on Linux and Mac OS X. It is part of the `dockstore` repository on GitHub, and is written in Java 8 with shell scripts.
URLs | [...]

#### dockstore-ui

&nbsp; | dockstore-ui
--- | ---
Project Link | [GitHub](https://github.com/ga4gh/dockstore-ui)
Maintainers | _None_
Description | A single-page web application written in AngularJS and Bootstrap (with a lot of plugins) that interfaces with the `dockstore-webservice`. At a minimum, users must register through this portal to acquire a `dockstore authentication token` and link accounts from GitHub, BitBucket, Quay.io and/or Docker Hub. Docker images may be published on this site after registration to share with other users.
URLs | [Staging Site (Development)](https://staging.dockstore.org/) (Only accessible in OICR subnet.), [Production Site (Public)](https://www.dockstore.org/)

## Environment Setup

### Database

PostgreSQL is used as the datastore for Dockstore, to install it on Ubuntu Linux 14.04 (substitute these instructions for Mac OS X ones if applicable):

1. In a terminal, run:

  ```
  sudo apt-get install postgresql postgresql-contrib
  ```

2. Create the two `dockstore-webservice` databases:

  ```
  sudo su - postgres
  psql
  ```

  1. `webservice`: Required in all setups. (Check the `Dockstore.yml` file for configuration changes.)

      ```
      CREATE USER webservice WITH PASSWORD 'iAMs00perSecrEET';
      CREATE DATABASE webservice;
      GRANT ALL PRIVILEGES ON DATABASE webservice to webservice;
      ```

  2. `webservice_test`: This one is for integration tests, it is only necessary if you wish to compile `dockstore` and run tests on the local environment (<sup>i.e.</sup> not required on Production):

      ```
      CREATE USER dockstore WITH PASSWORD 'dockstore';
      ALTER USER dockstore WITH superuser;
      CREATE DATABASE webservice_test WITH owner=dockstore;
      ```

### dockstore-webservice Back-end (REST API)

1. Install a Java 8 JDK, these instructions are for Ubuntu Linux 14.04:

  ```
  sudo add-apt-repository ppa:webupd8team/java
  sudo apt-get update
  sudo apt-get install oracle-java8-installer
  ```

2. Make sure that other build tools are installed:

  ```
  sudo apt-get install git maven3
  ```

3. In a directory (<sup>e.g.</sup> ~/workspace/ga4gh):

  ```
  git clone --recursive 'https://github.com/ga4gh/dockstore.git'
  ```

4. To build the project from the command line, go to the root directory of the repository and run:

  ```
  mvn clean install
  ```

  The output JARs are in their respective target folders in `dockstore-client/` and `dockstore-webservice/`.

5. The project may be imported into an IDE such as Eclipse or NetBeans for easier development.

### dockstore-ui Front-end (Web UI)

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

## Normal Workflow


### Deploying to Staging


### Deploying to Production


## Debugging

* Database/Hibernate ORM Issues


* Authentication Issues


