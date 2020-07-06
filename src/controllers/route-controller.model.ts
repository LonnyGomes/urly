import Router from '@koa/router';
import { UrlyDatabaseController } from '../db/db-controller';

export interface IRouteController {
    readonly router: Router;
    readonly controller: UrlyDatabaseController;
    initRouter(): Router;
}
