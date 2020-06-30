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

        router.get('/url/:hashKey', ApiController.getUrl);
        router.post('/url/', ApiController.postUrl);
        router.all('/(.*)', ApiController.invalidMessage);
        router.all('/(.*)/(.*)', ApiController.invalidMessage);

        return router;
    }

    public get router(): Router {
        return this._router;
    }

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
