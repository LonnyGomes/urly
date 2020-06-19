import * as dotenv from 'dotenv';
import { Context, Next } from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import helmet from 'koa-helmet';

dotenv.config();

const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const app = new Koa();

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

console.log(`Server started on on port ${PORT}`);

app.listen(PORT);
