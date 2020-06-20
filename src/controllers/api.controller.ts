import { Context } from 'koa';

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
}

// Define API routes
export const apiRouter = new Router();

apiRouter.get('/url/:fullUrl', ApiController.getUrl);
apiRouter.post('/url/', ApiController.postUrl);
