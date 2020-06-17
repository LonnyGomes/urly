import * as dotenv from 'dotenv';
import { Context, Next } from 'koa';

dotenv.config();

const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const app = new Koa();

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

// response

app.use(async (ctx: Context) => {
    ctx.body = 'Hello World';
});

console.log(`Server started on on port ${PORT}`);

app.listen(PORT);
