import { Context, Next } from 'koa';
import Router from '@koa/router';
import { UrlyDatabaseController } from '../db/db-controller';
import { UrlyDatabaseConnection } from '../db/db-connection';
import { IRouteController } from './route-controller.model';

export class ApiController implements IRouteController {
    private _dbController: UrlyDatabaseController;
    private _router: Router;

    constructor(db: UrlyDatabaseConnection) {
        this._dbController = new UrlyDatabaseController(db);
        this._router = this.initRouter();
    }

    initRouter(): Router {
        // Define API routes
        const router = new Router();

        router.get('/url/:shortId', this.getUrl.bind(this));
        router.post('/url/', this.postUrl.bind(this));
        router.all('/(.*)', this.invalidMessage.bind(this));
        router.all('/(.*)/(.*)', this.invalidMessage.bind(this));

        return router;
    }

    public get router(): Router {
        return this._router;
    }

    public get controller(): UrlyDatabaseController {
        return this._dbController;
    }

    public async getUrl(ctx: Context): Promise<void> {
        const fullUrl = 'https://www.google.com'; // TEMP implementation

        const { shortId } = ctx.params;

        if (!shortId) {
            throw new Error('shortId not supplied');
        }

        // TODO: sanitize shortId
        const result = await this._dbController.getByHash(shortId);

        if (result && result.url) {
            ctx.status = 200;
            ctx.body = { status: true, fullUrl };
        } else {
            ctx.status = 400;
            ctx.body = {
                status: false,
                message: `URL not found for ${shortId}`,
            };
        }
    }

    public async postUrl(ctx: Context): Promise<void> {
        const { fullUrl } = ctx.request.body;

        if (!fullUrl) {
            ctx.status = 400;
            ctx.body = {
                message: 'Missing fullUrl parameter',
            };
            return;
        }

        // TODO: sanitize input URL
        const { hash } = await this._dbController.insertURL(fullUrl);

        if (hash) {
            ctx.status = 200;
            ctx.body = {
                hash,
                fullUrl,
                shortUrl: `http://localhost:3000/${hash}`, // TEMP implementation
            };
        } else {
            ctx.status = 400;
            ctx.body = {
                message: 'Missing fullUrl parameter',
            };
        }
    }

    public async invalidMessage(ctx: Context, next: Next): Promise<void> {
        if (ctx.status === 404) {
            ctx.status = 200;
            ctx.body = { status: false, message: 'Invalid endpoint' };
        } else {
            await next();
        }
    }
}
