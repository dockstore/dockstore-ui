# dockstore-ui
AngularJS UI for the Dockstore Web Service.

### Running the AngularJS UI (Development)

1. The Dockstore web service and database should be running, and the API accessible on `http://localhost:8080`.

3. The GitHub application `Authorization callback URL` should be set to: `http://localhost:8090/login` in `app/app.module.js`.

4. The Quay.io application `Redirect/Callback URL Prefix` should be set to: `http://localhost:8090/accounts`  in `app/app.module.js`.

2. Run the Python library HTTP server on `http://localhost:8090` from the root directory of the project: `python rw-server.py 8090`.

5. Navigate to `http://localhost:8090` in a web browser.

6. It may be necessary to start Google Chrome from the command line w/ the option: `--disable-web-security` to suppress CORS/cross-domain security policies when running the application on a local environment. All open Chrome windows and processes must be exited before starting with this argument. On Mac OS X, use: `open -a Google\ Chrome --args --disable-web-security`.

### Compiling JavaScript Sources and Stylesheets
`TODO`
