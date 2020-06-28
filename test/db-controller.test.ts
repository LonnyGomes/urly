// Mock the db connection class as we are not testing that here
jest.mock('../src/db/db-connection.ts');

import { UrlyDatabaseConnection } from '../src/db/db-connection';
import { UrlyDatabaseController } from '../src/db/db-controller';
import { URLResultModel } from '../src/db/models';

describe('UrlyDatabaseController', () => {
    describe('constructor', () => {
        it('should store reference to database connection object', () => {
            const db = new UrlyDatabaseConnection('random/path.db');
            const controller = new UrlyDatabaseController(db);

            expect(db).toEqual(controller.db);
        });
    });

    describe('getByHash', () => {
        it('should return URL result for an existing hash', async () => {
            const dbAllResult: URLResultModel = {
                hash: 'abcd123',
                url: 'https://google.com',
            };
            const db = new UrlyDatabaseConnection('random/path.db');

            db.dbAll = jest.fn().mockImplementation(() => {
                return Promise.resolve([dbAllResult]);
            });

            const controller = new UrlyDatabaseController(db);
            const { hash, url } = await controller.getByHash('abcd123');

            expect(hash).toEqual(dbAllResult.hash);
            expect(url).toEqual(dbAllResult.url);
        });
    });
});
