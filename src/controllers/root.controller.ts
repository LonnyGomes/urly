import { Context, Next } from 'koa';

import Router from '@koa/router';
import { UrlyDatabaseController } from '../db/db-controller';
import { UrlyDatabaseConnection } from '../db/db-connection';

export class RootController {
    private _dbController: UrlyDatabaseController;
    private _router: Router;

    constructor(db: UrlyDatabaseConnection) {
        this._dbController = new UrlyDatabaseController(db);
        this._router = this.initRouter();
    }

    get router(): Router {
        return this._router;
    }

    private initRouter(): Router {
        // Define API routes
        const router = new Router();

        router.get('/:shortId', this.expandUrl.bind(this));

        return router;
    }

    public async expandUrl(ctx: Context, next: Next): Promise<void> {
        const { shortId } = ctx.params;

        // TODO: check for shortId mapping
        const fullUrl = 'http://www.google.com'; // TEMP implementation
        // console.log(`shortId param: ${shortId}`);

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
