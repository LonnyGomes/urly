// Mock the db connection class as we are not testing that here
jest.mock('../src/db/db-connection.ts');

import { UrlyDatabaseConnection } from '../src/db/db-connection';
import { UrlyDatabaseController } from '../src/db/db-controller';

describe('UrlyDatabaseController', () => {
    describe('constructor', () => {
        it('should store reference to database connection object', () => {
            const db = new UrlyDatabaseConnection('random/path.db');
            const controller = new UrlyDatabaseController(db);

            expect(db).toEqual(controller.db);
        });
    });
});
