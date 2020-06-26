import { UrlyDatabaseConnection } from '../src/db/db-connection';

describe('UrlyDatabaseConnection', () => {
    beforeEach(() => {
        // TODO
    });

    describe('constructor', () => {
        it('should save path the database file', () => {
            const inputPath = 'bogus.db';
            const db = new UrlyDatabaseConnection(inputPath);

            expect(db.dbPath).toEqual(inputPath);
        });
    });
});
