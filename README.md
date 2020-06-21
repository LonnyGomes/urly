# urly

![Node.js CI](https://github.com/LonnyGomes/urly/workflows/Node.js%20CI/badge.svg)

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

## API

This is basic REST API documentation. We eventually will move this to use swagger.

> **NOTE:** For now, any URL that matches a 6 digit hexadecimal hash (/[a-z0-9])will be redirected to google.com. Once an implementation is in place, this will change. As a test, navigate to http://localhost:3000/cafe12.

### GET /url/:shortId

Gets full URL from short id.

-   **Method**: GET
-   **Endpoint**: /url/:shortId

**Curl command**

```bash
curl http://localhost:3000/api/url/cab1234
```

### POST /url

Creates post shorten

-   **Method**: POST
-   **Endpoint**: /url/
-   **Body**: `shortId`

**Curl command**

```bash
curl http://localhost:3000/api/url/ -X POST -H "Content-Type: application/json" -d '{"fullUrl": "https://asf.com"}'
```

## Unit test

The unit test are managed with [Jest](https://jestjs.io) and can be run with the `npm test` command. While developing, add/modify unit tests in the the `test` folder. You can optionally run unit test in `watch` mode by running the following command:

```bash
npm run test:watch
```
