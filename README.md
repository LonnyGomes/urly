# urly

Proof of concept url shortener

This project uses [Koa](https://koajs.com) to implement a light-weight URL shortener service.

## Getting starting

You can get started by install the dependencies and running the dev server.

```bash
npm install
npm run start:dev
```

Once the server is started, open your browser to http://localhost:3000

You can chose a different port by defining the `PORT` environment variable.

```bash
PORT=3030 npm run start:dev
```

## Unit test

The unit test are managed with [Jest](https://jestjs.io) and can be run with the `npm test` command. While developing, add/modify unit tests in the the `test` folder. You can optionally run unit test in `watch` mode by running the following command:

```bash
npm run test:watch
```
