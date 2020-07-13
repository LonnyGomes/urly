import { Context, Next } from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import Router from '@koa/router';
import Debug from 'debug';
import { readFile } from 'fs-extra';
import { ApiController } from './controllers/api.controller';
import { RootController } from './controllers/root.controller';
import { UrlyDatabaseConnection } from './db/db-connection';

const Koa = require('koa');
const app = new Koa();

const debug = Debug('koa:app');

const PATHS = {
    NOT_FOUND: 'app/404.html',
    ERROR: 'app/error.html',
};

const readFileContents = async (filePath: string) => {
    const backupContents = `<html><head><title>Error</title>
                            <body><h1>Encountered an unspecified error</h1></body></html>`;

    let contents = null;
    try {
        contents = await readFile(filePath);
    } catch (error) {
        debug(`Failed to load file: ${filePath}`);
        contents = backupContents;
    }

    return contents;
};

// Add body parser to handle POST request data
app.use(bodyParser());

// Provides important security headers to make your app more secure
app.use(helmet());

// Handle 404/errors
app.use(async (ctx: Context, next: Next) => {
    // derived from the following SO solution:
    // https://stackoverflow.com/questions/37009352/how-to-handle-a-404-in-koa-2
    try {
        await next();
        const status = ctx.status || 404;
        if (status === 404) {
            ctx.throw(404);
        }
    } catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 404) {
            ctx.type = 'text/html';
            ctx.body = await readFileContents(PATHS.NOT_FOUND);
        } else {
            console.error('Encounters internal error', err);
            ctx.type = 'text/html';
            ctx.body = await readFileContents(PATHS.ERROR);
        }
    }
});
// logger

app.use(async (ctx: Context, next: Next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    debug(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx: Context, next: Next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// map base URL to html content
app.use(mount('/', serve('./app/')));

export function initServer(db: UrlyDatabaseConnection) {
    // create koa router
    const router = new Router();

    const apiRouter = new ApiController(db).router;
    // add api controller endpoints
    router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

    const rootRouter = new RootController(db).router;
    // add root controller endpoints
    router.use(rootRouter.routes(), rootRouter.allowedMethods());

    // add router middleware to app
    app.use(router.routes()).use(router.allowedMethods());

    return app;
}
