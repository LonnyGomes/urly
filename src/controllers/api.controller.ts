import { Context, Next } from 'koa';

import Router from '@koa/router';

export class ApiController {
    public static async getUrl(ctx: Context): Promise<void> {
        const fullUrl = 'https://www.google.com'; // TEMP implementation
        ctx.status = 200;
        ctx.body = { status: true, fullUrl };
    }

    public static async postUrl(ctx: Context): Promise<void> {
        const shortId = '78fd82'; // TEMP implementation
        const { fullUrl } = ctx.request.body;

        if (!fullUrl) {
            ctx.status = 403;
            return Promise.reject({
                status: false,
                message: 'Missing fullUrl parameter',
            });
        }

        ctx.status = 200;
        ctx.body = {
            status: true,
            fullUrl,
            shortUrl: `https://baseurl.me/${shortId}`, // TEMP implementation
        };
    }

    public static async invalidMessage(
        ctx: Context,
        next: Next
    ): Promise<void> {
        if (ctx.status === 404) {
            ctx.status = 200;
            ctx.body = { status: false, message: 'Invalid endpoint' };
        } else {
            await next();
        }
    }
}

// Define API routes
export const apiRouter = new Router();

apiRouter.get('/url/:fullUrl', ApiController.getUrl);
apiRouter.post('/url/', ApiController.postUrl);
apiRouter.all('/(.*)', ApiController.invalidMessage);
apiRouter.all('/(.*)/(.*)', ApiController.invalidMessage);
