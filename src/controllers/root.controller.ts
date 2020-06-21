import { Context, Next } from 'koa';

import Router from '@koa/router';

export class RootController {
    public static async expandUrl(ctx: Context, next: Next): Promise<void> {
        const { shortId } = ctx.params;

        // TODO: check for shortId mapping
        const fullUrl = 'http://www.google.com'; // TEMP implementation
        console.log(`shortId param: ${shortId}`);

        //TODO: if not found, redirect to a 404 page
        //      for now, just run a regEx
        if (shortId && shortId.match(/^[a-f0-9]{6}$/i)) {
            ctx.redirect(fullUrl);
        } else {
            ctx.status = 404;
            next();
        }
    }
}

// Define  routes
export const rootRouter = new Router();

rootRouter.get('/:shortId', RootController.expandUrl);
