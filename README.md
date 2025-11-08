# TradingPlatformClient

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## BUILD AND HOST

1.  Build the app:

ng build --configuration production

2. Copy to VPS:

Copy the entire dist/trading-platform-client folder to your VPS.

3. Run the SSR server on VPS:

Default port (4000):
node dist/trading-platform-client/server/server.mjs

Custom port using environment variable:
PORT=3000 node dist/trading-platform-client/server/server.mjs

4. Keep it running with PM2 (recommended):

Install PM2:
npm install -g pm2

Start the SSR server:
pm2 start dist/trading-platform-client/server/server.mjs --name trading-app

Save PM2 configuration:
pm2 save
pm2 startup

5. Configure with custom port (optional):

You can create a PM2 ecosystem file ecosystem.config.js:
module.exports = {
apps: [{
name: 'trading-app',
script: './dist/trading-platform-client/server/server.mjs',
env: {
PORT: 4000,
NODE_ENV: 'production'
}
}]
};
