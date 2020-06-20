import * as dotenv from 'dotenv';
import { Context, Next } from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import Router from '@koa/router';
import { apiRouter } from './controllers/api.controller';
import { rootRouter } from './controllers/root.controller';

dotenv.config();

const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const app = new Koa();

// Add body parser to handle POST request data
app.use(bodyParser());

// Provides important security headers to make your app more secure
app.use(helmet());

// logger

app.use(async (ctx: Context, next: Next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
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

// create koa router
const router = new Router();

// add api controller endpoints
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

// add root controller middleware
router.use(rootRouter.routes(), rootRouter.allowedMethods());

// add router middleware to app
app.use(router.routes()).use(router.allowedMethods());

console.log(`Server started on on port ${PORT}`);

app.listen(PORT);
