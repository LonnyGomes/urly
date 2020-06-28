// Mock the db connection class as we are not testing that here
jest.mock('../src/db/db-connection.ts');

import { UrlyDatabaseConnection } from '../src/db/db-connection';
import { UrlyDatabaseController } from '../src/db/db-controller';
import { URLResultModel } from '../src/db/models';

let db: UrlyDatabaseConnection;

describe('UrlyDatabaseController', () => {
    beforeEach(() => {
        db = new UrlyDatabaseConnection('random/path.db');
    });

    describe('constructor', () => {
        it('should store reference to database connection object', () => {
            const controller = new UrlyDatabaseController(db);

            expect(db).toEqual(controller.db);
        });
    });

    describe('getByHash', () => {
        it('should return an empty result if the hash is not found', async () => {
            // override the dbAll implementation
            const dbAllMock = jest.fn().mockImplementation(() => {
                return Promise.resolve([]);
            });
            db.dbAll = dbAllMock;

            const controller = new UrlyDatabaseController(db);
            const { hash, url } = await controller.getByHash('abcd123');

            expect(dbAllMock.mock.calls.length).toEqual(1);
            expect(hash).toEqual('');
            expect(url).toEqual('');
        });

        it('should return URL result for an existing hash', async () => {
            // override the dbAll implementation
            const dbAllMock = jest.fn().mockImplementation(() => {
                return Promise.resolve([dbAllResult]);
            });
            db.dbAll = dbAllMock;

            const dbAllResult: URLResultModel = {
                hash: 'abcd123',
                url: 'https://google.com',
            };

            const controller = new UrlyDatabaseController(db);
            const { hash, url } = await controller.getByHash('abcd123');

            expect(dbAllMock.mock.calls.length).toEqual(1);
            expect(hash).toEqual(dbAllResult.hash);
            expect(url).toEqual(dbAllResult.url);
        });
    });
});
