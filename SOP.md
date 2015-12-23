# Dockstore Standard Operating Procedures

This document contains an overview of the entire Dockstore project, and instructions for setting up and maintaining the staging and production servers for hosting Dockstore. More specfic information can be found in the respective GitHub repositories of each subcomponent and in the official documentation.

### Table of Contents
* [Dockstore Components](#dockstore-components)
  * [dockstore-webservice](#dockstore-webservice)
  * [dockstore-client](#dockstore-client)
  * [dockstore-ui](#dockstore-ui)
* [Terminology](#terminology)
* [Third-Party API Integration](#third-party-api-integration)
  * [Token Scopes and Permissions](#token-scopes-and-permissions)
  * [Redirect URLs](#redirect-urls)
  * [Authorization Flows](#authorization-flows)
  * [Satellizer and JSON Web Tokens](#satellizer-and-json-web-tokens)
* [Configuration Parameters](#configuration-parameters)
  * [Dockstore API](#dockstore-api)
  * [Dockstore Web UI](#dockstore-web-ui)
* [Environment Setup](#environment-setup)
  * [Database](#database)
  * [Dockstore API](#dockstore-api-1)
  * [Dockstore Web UI](#dockstore-web-ui-1)
* [Normal Workflow](#normal-workflow)
  * [Server Deployment](#server-deployment)
    * [Dockstore Servers](#dockstore-servers)
    * [Setting Up a Server](#setting-up-a-server)
    * [Deploying to Staging](#deploying-to-staging)
    * [Deploying to Production](#deploying-to-production)
* [Debugging](#debugging)
  * [Database/ORM Issues](#databaseorm-issues)
  * [Authentication Issues](#authentication-issues)

## Dockstore Components

The Dockstore project consists of three major components: the `dockstore-webservice`, the `dockstore-client` and the `dockstore-ui`.

### dockstore-webservice

&nbsp; | dockstore-webservice
--- | ---
Project Link | [GitHub](https://github.com/ga4gh/dockstore)
Maintainers | [denis-yuen](https://github.com/denis-yuen)
Description | The central REST API providing all the functions of Dockstore, including user accounts and token-based authentication, Docker image registration, synchronization and management, and publication controls. It is written in Java 8 using the [Dropwizard Framework](http://www.dropwizard.io/) for the REST API and [Swagger](http://swagger.io/) for endpoint documentation/interactive testing.
URLs | [Dockstore API (Staging)](https://staging.dockstore.org:8443/static/swagger-ui/index.html), [Dockstore API (Production)](https://www.dockstore.org:8443/static/swagger-ui/index.html)

### dockstore-client

&nbsp; | dockstore-client
--- | ---
Project Link | [GitHub](https://github.com/ga4gh/dockstore)
Maintainers | [denis-yuen](https://github.com/denis-yuen)
Description | A command line interface client for the `dockstore-webservice`, supported on Linux and Mac OS X. It is part of the `dockstore` repository on GitHub, and is written in Java 8 with shell scripts.
URLs | [...]

### dockstore-ui

&nbsp; | dockstore-ui
--- | ---
Project Link | [GitHub](https://github.com/ga4gh/dockstore-ui)
Maintainers | _None_
Description | A single-page web application written in AngularJS and Bootstrap (with a lot of plugins) that interfaces with the `dockstore-webservice`. At a minimum, users must register through this portal to acquire a `dockstore authentication token` and link accounts from GitHub, BitBucket, Quay.io and/or Docker Hub. Docker images may be published on this site after registration to share with other users.
URLs | [Dockstore Website (Staging)](https://staging.dockstore.org/) (Only accessible in OICR subnet.), [Dockstore Website (Production)](https://www.dockstore.org/)

## Terminology

Term | Definition
--- | ---
Image | A Docker image, containing an OS and prespecified software, built from a specific version of a Dockerfile.
Container\* | An instance of a Docker image, possibly running a workflow on a set of inputs.
GitHub | A service for hosting Git Repositories, used to host the Dockstore project, issues tracking and Docker images.
BitBucket | Another service for hosting Mercurial/Git Repositories
Quay.io | A registry for building and hosting public and private Docker images.
Docker Hub | The official Docker registry for building and hosting Docker images, API is closed.
Re-sync | Calls the `/refresh` endpoint to pull new data and cache files from GitHub, Bitbucket and Quay.io to all the images administrated by a user.
Publish | Makes an image visible on Dockstore to the public, this function does not alter anything on its image registry.
\* _Images_ are currently called _Containers_ on Dockstore, a [heroic renaming effort](https://github.com/ga4gh/dockstore/issues/36) is underway to correct this. In the context of `dockstore-ui` however, what are currently known as _Containers_ is actually a collection of _Images_, but _Images_ will be used in the absence of a more appropriate term.

## Third-Party API Integration

Dockstore supports integration with GitHub, Bitbucket and Quay.io through [Oauth 2.0](http://oauth.net/2/). An 'OAuth application' must be registered for each of these services, this will provide you with a Client ID/Secret key pair and the ability to request users' permission to generate scope-restricted API tokens on their behalf. This linking process only needs to be performed once (unless the token is revoked, expires or otherwise becomes invalid), it is done through the Web UI upon login (in the `Onboarding Wizard`), the secret key is only kept and used by the Dockstore API.

### Token Scopes and Permissions

For security and privacy reasons, Dockstore should only request the minimum set of permissions required for it to perform its operations. The table below lists the current scopes/permissions for each provider:

Provider | Scopes/Permissions
--- | ---
GitHub | read:org,user:email
Bitbucket | Account(Email, Read), Team Membership (Read), Repositories (Read), Pull Requests (Read), Issues (Read\*), Wikis (Read\*, Write\*), Snippets (Read\*)
Quay.io | repo:read,user:read
\* Probably don't need these, should test without them before removing.

### Redirect URLs

After authenticating, per the OAuth 2.0 flow, the user is redirected to a pre-determined page given by the 'Redirect URL', for `dockstore-production`, they should be configured as:

Provider | Redirect URL
--- | ---
GitHub | https://www.dockstore.org/login
Bitbucket | https://www.dockstore.org/auth/quay.io
Quay.io | https://www.dockstore.org/auth/bitbucket.org

### Authorization Flows

GitHub uses the [Authorization Code Grant](https://tools.ietf.org/html/rfc6749#section-1.3.1) flow for obtaining access tokens, GitHub is also currently the sole authentication provider for Dockstore:
  
  1. From the login screen of the Web UI, a pop-up appears to a GitHub login page. This is a special page configured with the GitHub **Client ID** parameter.
  2. Upon completion, an **Access Code** is returned to Web UI, this is passed to the Dockstore API through an AJAX call.
  3. The Dockstore API makes an API call to GitHub, with the **Access Code** and **Secret Key**, it receives an **Access Token** in return. If a Dockstore user with the GitHub username does not exist, a new user account will be created. A Dockstore token is then generated and/or returned.
  4. From the Web UI side, the Dockstore API call with the **Access Code** finishes and returns a **Dockstore Token**, this is stored in the browser's _[Local Storage](http://www.html5rocks.com/en/features/storage)_ (as defined by HTML5) for the domain, and sent with every subsequent HTTP call in the header as the _Bearer_ token.
  5. The logout action will cause the Dockstore token to be deleted from Local Storage, no action is taken on the Dockstore API side to invalidate neither the GitHub token nor the Dockstore token.

Bitbucket and Quay.io use the simplified [Implicit Grant](https://tools.ietf.org/html/rfc6749#section-1.3.2) flow:

  1. From the _Onboarding Wizard_ or _Accounts_ page on the Web UI, a user may link their Bitbucket and Quay.io accounts by clicking the respective 'Link Account' button.
  2. The user is taken to the provider's site (with the **Client ID**, redirect URI and scope information as parameters) to login and authorize the Dockstore application.
  3. The user is then redirected back to the Web UI, with a new Access Token in the URL as GET parameters, this is parsed in AngularJS and sent to the Dockstore API through an AJAX call.
  4. If this is a Quay.io token, all of the user's Dockstore images will be refreshed immediately before continuing.
  5. Finally, the Web UI goes to the _Onboarding Wizard_ page, the 'Link Account' button be replaced by a green 'Linked' label to indicate that the linking process was completed successfully.

### Satellizer and JSON Web Tokens

The Dockstore Web UI currently only supports authentication through GitHub (and soon: Bitbucket, Google, ...), native authentication via Username and Password login will eventually be supported. The authentication mechanism is provided by [Satellizer](https://github.com/sahat/satellizer), an AngularJS plugin.

The Dockstore API does not return a token in the [JSON Web Token](http://jwt.io/) (JWT) format through a POST request as expected by Satellizer, this necessitated a small modification to the code. The modified library can be found in: `app/scripts/libs/satellizer/satellizer-ds.js` of the `dockstore-ui` project.

## Configuration Parameters

### Dockstore API

At runtime, the `dockstore-webservice` configuration is read from the `dockstore.yml` file passed as the second argument.

This is the template for the `dockstore-staging` configuration file, with TLS encryption (the certificates are in `dockstore.org.keystore`):

```
template: Hello, %s!
quayClientID: <QUAY_APPLICATION CLIENT_ID>
quayRedirectURI: https://staging.dockstore.org/auth/quay.io
githubClientID: <GITHUB_APPLICATION_CLIENT_ID>
githubClientSecret: <GITHUB_APPLICATION_CLIENT_SECRET>
githubRedirectURI: https://staging.dockstore.org/login
bitbucketClientID: <BITBUCKET_APPLICATION_CLIENT_ID>
bitbucketClientSecret: <BITBUCKET_APPLICATION_CLIENT_SECRET>
hostname: staging.dockstore.org
scheme: https
port: 8443

authenticationCachePolicy: maximumSize=10000, expireAfterAccess=10m

httpClient:
  timeout: 5500ms
  connectionTimeout: 5500ms
  timeToLive: 1h
  cookiesEnabled: false
  maxConnections: 1024
  maxConnectionsPerRoute: 1024
  keepAlive: 0ms
  retries: 0

server:
  applicationConnectors:
    - type: https
      port: 8443
      keyStorePath: dockstore.org.keystore
      keyStorePassword: <KEYSTORE_PASSWORD>
      validateCerts: false

authenticationCachePolicy: maximumSize=10000, expireAfterAccess=10m

database:
  # the name of your JDBC driver
  driverClass: org.postgresql.Driver

  # the username
  user: webservice

  # the password
  password: iAMs00perSecrEET

  # the JDBC URL
  url: jdbc:postgresql://localhost:5432/webservice

  # any properties specific to your JDBC driver:
  properties:
    charSet: UTF-8
    hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
    # create database as needed, disable in production
    hibernate.hbm2ddl.auto: create

  # the maximum amount of time to wait on an empty pool before throwing an exception
  maxWaitForConnection: 1s

  # the SQL query to run when validating a connection's liveness
  validationQuery: "/* MyApplication Health Check */ SELECT 1"

  # the minimum number of connections to keep open
  minSize: 8

  # the maximum number of connections to keep open
  maxSize: 32

  # whether or not idle connections should be validated
  checkConnectionWhileIdle: false
```

**Notes**:
* On `dockstore-staging` and `dockstore-production`, the Dockstore API is binded to port 8443, with TLS configured. On local development environments, it is binded to port 8080.
* `quayRedirectURI` and `githubRedirectURI` are only used for the development of the web service, when the Web UI is bypassed, their values are ignored otherwise
* `hibernate.hbm2ddl.auto` can be set to:
  * `create`: Clears the database on restart
  * `update`: Keeps existing database contents, performs in-place updates to table structure
  * `validate`: Validates the schema, does not alter the database
  * `create-drop`: Clears database on termination
  * The `dockstore-production` instance **must always** be set to use `update` or `validate`!!

### Dockstore Web UI

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

  1. `webservice`: Required in all setups. (Check the `Dockstore.yml` file for configuration changes. Change the database password, obviously.)

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

### Dockstore API

1. Install a Java 8 JDK, follow the instructions and installer prompts for Ubuntu Linux 14.04:

  ```
  sudo add-apt-repository ppa:webupd8team/java
  sudo apt-get update
  sudo apt-get install oracle-java8-installer
  echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.profile
  source
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

### Dockstore Web UI

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

### Server Deployment

This section describes the structure of the Dockstore server environments, and recommended instructions on how to maintain the server, perform backups, update the Dockstore builds and publish new releases.

#### Dockstore Servers

Name | IP Address (Public) | Hostname | Location | Details
--- | --- | --- | --- | ---
dockstore-staging | 52.3.124.195 | [staging.dockstore.org](https://staging.dockstore.org/) | us-east-1 | AWS EC2 Instance, Ubuntu Linux 14.04.03
dockstore-production | 52.23.25.242  | [www.dockstore.org](https://www.dockstore.org/) | us-east-1 | AWS EC2 Instance, Ubuntu Linux 14.04.03

#### Setting Up a Server

The `dockstore-webservice` requires a Java 8 VM to run, but is otherwise standalone, and has no additional dependencies or need for application servers. The `dockstore-ui` produces compiled static HTML/CSS/JS code, it only requires an HTTP server, with minor configuration settings to support HTML5-style URLs. NGINX is used for serving the files and providing TLS encryption to the client.

The following instructions will assume that the server is provisioned with an Ubuntu Linux 14.04 image.

1. Install Java 8, installing the full JDK will allow Dockstore to be built on the server:

  ```
  sudo add-apt-repository ppa:webupd8team/java
  sudo apt-get update
  sudo apt-get install oracle-java8-installer
  echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.profile
  source
  ```

2. Install other programs and utilities through the package manager:

  ```
  sudo apt-get install nginx postgres postgres-contrib python3 awscli
  ```

3. Set up the database:

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

4. Configure NGINX with URL redirection and TLS certificates:
  1. Create a virtual host file in /etc/nginx/sites-available/.
  2. This is an example NGINX server host file, replace the variables in the <> brackets accordingly:

    ```
    ## Dockstore Staging Server

    # HTTP Redirect
    server {
            listen 80;
            server_name staging.dockstore.org;
            return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
            listen 443 ssl;
            server_name staging.dockstore.org;

            root /srv/www/staging.dockstore.org/public_html;
            index index.html index.htm;

            ssl on;
            ssl_certificate <PATH_TO_TLS_CERT>;
            ssl_certificate_key <PATH_TLS_KEY>;

            ssl_session_timeout 5m;

            ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
            ssl_ciphers "HIGH:!aNULL:!MD5 or HIGH:!aNULL:!MD5:!3DES";
            ssl_prefer_server_ciphers on;

            location / {
                    try_files $uri $uri/ /index.html =404;
            }

            error_page 404 /index.html;
    }
    ```

  3. After saving the file, create a symlink to it in `/etc/nginx/sites-enabled`:

    ```
    ln -s '/etc/nginx/sites-available/<filename>' '/etc/nginx/sites-enabled/<filename>'
    ```

  4. Reload the NGINX process to let the new configuration take effect:

    ```
    sudo service nginx reload
    ```

5. The same TLS certificates used in the previous step can be used to create a Java Keystore file for use with `dockstore-webservice`.

6. Nightly back-ups of the database are performed on the `dockstore-production` server, this can be set up on any other server:
  1. Login as the `postgres` user with: `sudo su - postgres`
  2. Set an AWS access key pair for the account, the database dump will be backed-up to an Amazon S3 bucket:

    ```
    $ aws configure
    AWS Access Key ID [None]: <AWS_ACCESS_KEY_ID>
    AWS Secret Access Key [None]: <AWS_ACCESS_SECRET_KEY>
    Default region name [None]: us-east-1
    Default output format [None]: JSON
    ```

  3. Create a simple back-up script and save it in `~/cron/db_backup.sh`, set the variables accordingly:

    ```
    #!/usr/bin/env bash

    set -e

    s3_url_db_backup='s3://oicr.backups/dockstore.org/database/'`date +%Y-%m-%d`
    temp_dir=`mktemp -d`
    output_file=ds-webservice_${2:-prod}_`date +%Y-%m-%dT%H-%M-%S%z`.sql

    pg_dump ${1:-webservice} > $temp_dir/$output_file

    aws s3 cp $temp_dir/$output_file $s3_url_db_backup/

    echo "Dumped database ${1:-webservice} and uploaded to $s3_url_db_backup/$output_file."
    ```

  4. Add a Cron entry to back-up the Dockstore database every night at 11:55 pm.

    ```
    $ crontab -e
    ```

    Append the following to the end of the file:

    ```
    55 23 * * * echo '['`date`'] Nightly Back-up' >> /var/lib/postgresql/cron/ds_backup.log && /var/lib/postgresql/cron/ds_backup.sh 2>&1 >> /var/lib/postgresql/cron/ds_backup.log
    ```

  5. After verifying that the script and cron configuration works as expected, make the final changes and logout.

#### Deploying to Staging

The staging server should be set up to build the respective `develop` branches of `dockstore` and `dockstore-ui`.

1. The local Git repositories are located in `/home/ubuntu/workspace/`, they are set up so that the server can be easily updated with new changes.

2. To update the `dockstore-webservice`:
  1. Attach to the active [tmux](https://tmux.github.io/) session: `tmux attach`.

  2. Press CTRL+C to to end `dockstore-webservice` process, this is typically in the first tab.

  3. Pull the latest version of the `develop` branch: `git pull` in the `/home/ubuntu/workspace/dockstore` directory.

  4. Build the project: `mvn clean install`

  5. Start the new `dockstore-webservice` in the same directory:

    ```
    java -jar dockstore-webservice/target/dockstore-webservice-*.jar server ~/.dockstore/dockstore.yml 2>&1 | tee ~/.dockstore/dockstore-webservice.log
    ```

    The server output will be saved in `~/.dockstore/dockstore-webservice.log`.

  6. Press `CTRL+B` and then `d` to detach from the tmux session.

3. To update the `dockstore-ui`:
  1. Change directory to `/home/ubuntu/workspace/dockstore-ui`.
  
  2. Pull the latest version of the `develop` branch: `git pull`
  
  3. Select the stable version of Node.js in this terminal session: `nvm use stable`

  4. Build/compile the project: `grunt`

  5. The compiled Web UI is now in the `dist` folder, the NGINX configuration is set up to link to this folder, so the changes are immediately served. Refresh the Dockstore page(s) and cache in the browser on your local computer.

#### Deploying to Production

The production server is set up similarly to staging, except the files are not served directly from the `/home/ubuntu/workspace` directory.

1. Perform a back-up of the production database, this may simply be triggering the normal back-up script. Also save a copy of the `dockstore-webservice` log: `/srv/dockstore/dockstore-webservice.log`.

2. To update `dockstore-webservice`:
  1. Terminate the active `dockstore-webservice` instance with your favourite process-killing program:

    ```
    ps aux | grep java
    kill <PID>
    ```

  2. Replace the `dockstore-webservice` production JAR file in `/srv/dockstore/` with the newly-built one (`wget` from [Artifactory](https://seqwaremaven.oicr.on.ca/artifactory/) or use `scp` to upload it).

  3. Start the new `dockstore-webservice`:

    ```
    nohup java -jar /srv/dockstore/dockstore-webservice-<VERSION>.jar server /srv/dockstore/dockstore.yml &> dockstore-webservice.log &
    ```

3. To update the `dockstore-ui`:
  1. Change the directory to `/srv/www/www.dockstore.org/public_html`. Delete the all the files in the directory.

  2. Build the `dockstore-ui` release locally, with the `webservice.js` file configured with the `dockstore-production` Client ID/Secret key pairs and other settings.

  3. Upload the `dockstore-ui` production build to this folder.

  4. Change the files' owner to the webserver group/user:

    ```
    chown -R www-data:www-data /srv/www/www.dockstore.org/public_html/*
    ```

  5. Refresh your browser/caches to make the changes take effect locally.

## Debugging

### Database/ORM Issues
* `dockstore-webservice`
  * Errors on start-up when `dockstore.yml` configuration set with `hibernate.hbm2ddl.auto: update`
    * Read the error message
    * Columns may not have been created if they were set to `NOT NULL`, and a default value was not specified with it in Hibernate, this will cause the web service to malfunction:
      1. Login as the `postgres` user and manually create the missing column(s)
      2. Copy/migrate data to the new column(s) as necessary
      3. Perform a refresh/re-sync of the Docker images

### Authentication Issues
* `dockstore-ui`
  * Pop-up appears and disappears, redirects to a blank page or shows message about an invalid redirect URI
    * Verify the server's response by examining the AJAX call log in the browser's _Network_ tab
    * Check that the correct Client ID/Secret key pair are used, and are set to the correct application (Development, Staging and Production all use distinct applications)
    * The Redirect URI in the third-party application configuration must be identical to the one in the `dockstore-ui` configuration (in `app/scripts/services/webservice.js`)

