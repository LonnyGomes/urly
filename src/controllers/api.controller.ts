import { Context, Next } from 'koa';
import Router from '@koa/router';
import { UrlyDatabaseController } from '../db/db-controller';
import { UrlyDatabaseConnection } from '../db/db-connection';

export class ApiController {
    private _dbController: UrlyDatabaseController;
    private _router: Router;

    constructor(db: UrlyDatabaseConnection) {
        this._dbController = new UrlyDatabaseController(db);
        this._router = this.initRouter();
    }

    private initRouter(): Router {
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

    public async invalidMessage(ctx: Context, next: Next): Promise<void> {
        if (ctx.status === 404) {
            ctx.status = 200;
            ctx.body = { status: false, message: 'Invalid endpoint' };
        } else {
            await next();
        }
    }
}
