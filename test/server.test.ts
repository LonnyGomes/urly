import request from 'supertest';
import { initServer } from '../src/server';
import { UrlyDatabaseConnection } from '../src/db/db-connection';

const DB_MEMORY_PATH = ':memory:'; // use_in memory db
const EXPECTED_HASH = 'r7r2u6m';
const EXPECTED_URL = 'http://google.com';

const seedDb = async (db: UrlyDatabaseConnection) => {
    // insert test data
    await db.dbRunPrepared('INSERT INTO url (hash, url) VALUES(?, ?)', [
        EXPECTED_HASH,
        EXPECTED_URL,
    ]);
};

describe('koa server', () => {
    let server: any;
    let db: UrlyDatabaseConnection;

    beforeEach(async () => {
        db = new UrlyDatabaseConnection(DB_MEMORY_PATH);
        await db.init();

        await seedDb(db);

        const app = initServer(db);
        server = app.callback();
    });

    describe('app', () => {
        it('should return index page', async () => {
            const response: any = await request(server).get('/');

            expect(response.status).toEqual(200);
            expect(response.type).toEqual('text/html');
            expect(response.text).toMatch(/<html>/);
        });

        it('should redirect to 404 url if page not found', async () => {
            const titleRegex = /<title>.*404.*<\/title>/;
            const response: any = await request(server).get('/bogus-file.html');

            expect(response.status).toEqual(404);
            expect(response.type).toEqual('text/html');
            expect(response.text).toMatch(titleRegex);
        });
    });

    describe('/', () => {
        describe('GET /:shortId', () => {
            it('should redirect to 404 url if hash is invalid', async () => {
                const inputShortId = 'abcd123';
                const titleRegex = /<title>.*404.*<\/title>/;
                const response: any = await request(server).get(
                    `/${inputShortId}`
                );

                expect(response.status).toEqual(404);
                expect(response.type).toEqual('text/html');
                expect(response.text).toMatch(titleRegex);
            });

            it('should redirect to URL given proper hash', async () => {
                const inputShortId = EXPECTED_HASH;
                const expectedUrl = EXPECTED_URL;
                const response: any = await request(server).get(
                    `/${inputShortId}`
                );

                expect(response.status).toEqual(302);
                expect(response.header.location).toEqual(expectedUrl);
            });
        });
    });

    describe('/api', () => {
        describe('GET /url:fullUrl', () => {
            it('should return a 400 error when an  invalid hash is supplied', async () => {
                const expectedHashKey = 'aaaaaaa';
                const expectedResponse = {
                    status: false,
                    message: `URL not found for ${expectedHashKey}`,
                };
                const response: any = await request(server).get(
                    `/api/url/${expectedHashKey}`
                );

                expect(response.status).toEqual(400);
                expect(response.body).toEqual(expectedResponse);
            });

            it('should return a URL when a valid hash is supplied', async () => {
                const expectedHashKey = EXPECTED_HASH;
                const expectedResponse = {
                    status: true,
                    fullUrl: 'https://www.google.com',
                };
                const response: any = await request(server).get(
                    `/api/url/${expectedHashKey}`
                );

                expect(response.status).toEqual(200);
                expect(response.body).toEqual(expectedResponse);
            });
        });

        describe('POST /url', () => {
            it('should return a 400 error if fullUrl param is not supplied', async () => {
                const response: any = await request(server)
                    .post('/api/url/')
                    .set('Accept', 'application/json');

                expect(response.status).toEqual(400);
                expect(response.body.message).toMatch(
                    /Missing fullUrl parameter/
                );
            });

            it('should generate and save a shorten URL when a valid URL is supplied', async () => {
                const inputUrl = 'http://my.google.com';
                const expectedShortUrl = /^http:\/\/localhost:3000\//;
                const response: any = await request(server)
                    .post('/api/url/')
                    .send({ fullUrl: inputUrl })
                    .set('Accept', 'application/json');

                const { hash, fullUrl, shortUrl } = response.body;

                expect(response.status).toEqual(200);

                // verify hash result param
                expect(hash).toBeDefined();

                // verify full url result param
                expect(fullUrl).toBeDefined();
                expect(fullUrl).toEqual(inputUrl);

                // verify short url result param
                expect(shortUrl).toBeDefined();
                // TOOD: enhance this unit test once the config is implemented
                expect(shortUrl).toMatch(expectedShortUrl);
            });
        });
    });
});
