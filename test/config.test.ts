// redeclare process.env to avoid Typescript errors
// Reference: https://bit.ly/2ZfA2i0 (medium.com)
declare namespace NodeJS {
    export interface ProcessEnv {
        PORT?: number;
        BASE_URL: string;
    }
}

const DEFAULT_PORT = 3000;
const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_DB_PATH = 'src/db/urly.db';

describe('config', () => {
    beforeEach(() => {
        // for these tests, we need to reload the config module each time
        jest.resetModules();
    });

    describe('PORT', () => {
        beforeEach(() => {
            delete process.env.PORT;
        });

        afterEach(() => {
            delete process.env.PORT;
        });

        it('should define a default port', () => {
            const { UrlyConfig } = require('../src/config');
            const config = UrlyConfig({ enableDotEnv: false });

            expect(config.PORT).toEqual(DEFAULT_PORT);
        });

        it('should be overridden by an environment variable', () => {
            process.env.PORT = 4000;
            const { UrlyConfig } = require('../src/config');
            const config = UrlyConfig();

            expect(config.PORT).toEqual(4000);
        });
    });

    describe('BASE_URL', () => {
        beforeEach(() => {
            delete process.env.BASE_URL;
        });

        afterEach(() => {
            delete process.env.BASE_URL;
        });

        it('should define a default base url', () => {
            const { UrlyConfig } = require('../src/config');
            const config = UrlyConfig({ enableDotEnv: false });

            expect(config.BASE_URL).toEqual(DEFAULT_BASE_URL);
        });

        it('should be overridden by an environment variable', () => {
            process.env.BASE_URL = 'https://custom.url.com/';
            const { UrlyConfig } = require('../src/config');
            const config = UrlyConfig();

            expect(config.BASE_URL).toEqual('https://custom.url.com/');
        });
    });

    describe('DB_PATH', () => {
        beforeEach(() => {
            delete process.env.DB_PATH;
        });

        afterEach(() => {
            delete process.env.DB_PATH;
        });

        it('should define a default base url', () => {
            const { UrlyConfig } = require('../src/config');
            const config = UrlyConfig({ enableDotEnv: false });

            expect(config.DB_PATH).toEqual(DEFAULT_DB_PATH);
        });

        it('should be overridden by an environment variable', () => {
            process.env.DB_PATH = 'src/db/custom.db';
            const { UrlyConfig } = require('../src/config');
            const config = UrlyConfig();

            expect(config.DB_PATH).toEqual('src/db/custom.db');
        });
    });
});
