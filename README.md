# urly

![Node.js CI](https://github.com/LonnyGomes/urly/workflows/Node.js%20CI/badge.svg)

Proof of concept url shortener

This project uses [Koa](https://koajs.com) to implement a light-weight URL shortener service.

## Getting starting

To get started, install the dependencies and running the dev server.

```bash
npm install
npm run start:dev
```

Once the server is started, open your browser to http://localhost:3000

You can chose a different port by defining the `PORT` environment variable.

```bash
PORT=3030 npm run start:dev
```

## Configuration

The configuration parameters can be set either by an environment variable or a through a `.env` file stored in the root of the project. Below are the configurable parameters along with their default values:

| Parameter | Description                                                         | Default               |
| --------- | ------------------------------------------------------------------- | --------------------- |
| PORT      | HTTP port server listens on                                         | 3000                  |
| BASE_URL  | url to use as the base shortener                                    | http://localhost:3000 |
| DB_PATH   | path to store the db. If the file doesn't exist, it will be created | `src/db/urly.db`      |

**Example .env file**

A `.env` file can store all customized configurations

```
BASE_URL="https://my.customurl.com"

PORT=2600

# comments are allowed
DB_PATH=src/db/new.db
```

**Example using environment variables**

The following defines the base URL that is used when generating a shortened link:

```bash
BASE_URL=https://myurl.com npm start
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

## Debugging Output

This project uses the [debug](https://www.npmjs.com/package/debug) package to allow you to selectively display debug messages. The debug output depends on the `DEBUG` environment variable. If you set the value to `*` you will see all the debug information but you can optionally fine-tune what is displayed. Below are a few examples:

**Displaying all debug output while running the serve**

```bash
DEBUG=* npm start
```

**Displaying Database debug output while running unit tests**

```bash
DEBUG=db:* npm run test:watch
```

## Unit test

The unit test are managed with [Jest](https://jestjs.io) and can be run with the `npm test` command. While developing, add/modify unit tests in the the `test` folder. You can optionally run unit test in `watch` mode by running the following command:

```bash
npm run test:watch
```
