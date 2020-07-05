import { Context, Next } from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import Router from '@koa/router';
import Debug from 'debug';
import { ApiController } from './controllers/api.controller';
import { RootController } from './controllers/root.controller';
import { UrlyDatabaseConnection } from './db/db-connection';

const Koa = require('koa');
const app = new Koa();

const debug = Debug('koa:app');

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
            await ctx.redirect('/404.html');
        } else {
            console.error('Encounters internal error', err);
            await ctx.redirect('/error.html');
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
