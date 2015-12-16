# Dockstore Standard Operating Procedures

### Dockstore Components

The Dockstore project consists of three major components: the `dockstore-webservice`, the `dockstore-client` and the `dockstore-ui`.

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

### Third-Party API Integration

Dockstore supports integration with GitHub, Bitbucket and Quay.io through [Oauth 2.0](http://oauth.net/2/). An 'OAuth application' must be registered for each of these services, this will provide you with a Client ID/Secret key pair and the ability to request users' permission to generate scope-restricted API tokens on their behalf. This linking process only needs to be performed once (unless the token is revoked, expires or otherwise becomes invalid), it is done through the Web UI upon login (in the `Onboarding Wizard`), the secret key is only kept and used by the Dockstore API.

#### Token Scopes and Permissions

For security and privacy reasons, Dockstore should only request the minimum set of permissions required for it to perform its operations. The table below lists the current scopes/permissions for each provider:

Provider | Scopes/Permissions
--- | ---
GitHub | read:org
Bitbucket | Account(Email, Read), Team Membership (Read), Repositories (Read), Pull Requests (Read), Issues (Read\*), Wikis (Read\*, Write\*), Snippets (Read\*)
Quay.io | repo:read,user:read
\* Probably don't need these, should test without them before removing.

#### Redirect URLs

After authenticating, per the OAuth 2.0 flow, the user is redirected to a pre-determined page given by the 'Redirect URL', for `dockstore-production`, they should be configured as:

Provider | Redirect URL
--- | ---
GitHub | https://www.dockstore.org/login
Bitbucket | https://www.dockstore.org/auth/quay.io
Quay.io | https://www.dockstore.org/auth/bitbucket.org

#### Authorization Flows

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

#### Satellizer and JSON Web Tokens

The Dockstore Web UI currently only supports authentication through GitHub (and soon: Bitbucket, Google, ...), native authentication will eventually be supported. The authentication mechanism is provided by [Satellizer](https://github.com/sahat/satellizer), an AngularJS plugin.

The Dockstore API does not currently return a token in the [JSON Web Token](http://jwt.io/) (JWT) format through a POST request as expected by Satellizer, this necessitated a small modification to the code. The modified library can be found in: `app/scripts/libs/satellizer/satellizer-ds.js` of the `dockstore-ui` project.

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

### Server Deployment

This section describes the strcuture of the Dockstore server environments, and recommended instructions on how to maintain the server, perform backups, update the Dockstore builds and publish new releases.

#### Dockstore Servers

Name | IP Address (Public) | Hostname | Location | Details
--- | --- | --- | --- | ---
dockstore-staging | 52.3.124.195 | [staging.dockstore.org](https://staging.dockstore.org/) | us-east-1 | AWS [...] Instance, Ubuntu 14.04.03
dockstore-production | 52.23.25.242  | [www.dockstore.org](https://www.dockstore.org/) | us-east-1 | AWS [...] Instance, Ubuntu 14.04.03

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

5. The same TLS certificates used in the previous step can be used to create a Java Keystore file for use with `dockstore-webservice`. [...]

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

The staging server should be set up to build the respective `develop` branches of dockstore and dockstore-ui.

#### Deploying to Production



## Debugging

* Database/Hibernate ORM Issues


* Authentication Issues
  * `dockstore-ui`
    * Pop-up appears and disappears, redirects to a blank page or shows message about an invalid redirect URI
      *

