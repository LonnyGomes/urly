import { Context } from 'koa';

import Router from '@koa/router';

export class RootController {
    public static async expandUrl(ctx: Context): Promise<void> {
        const { shortId } = ctx.params;

        // TODO: check for shortId mapping
        const fullUrl = 'http://www.google.com'; // TEMP implementation
        console.log(`shortId param: ${shortId}`);

        //TODO: if not found, redirect to a 404 page
        ctx.redirect(fullUrl);
    }
}

// Define  routes
export const rootRouter = new Router();

rootRouter.get('/:shortId', RootController.expandUrl);
