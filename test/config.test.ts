declare namespace NodeJS {
    export interface ProcessEnv {
        PORT?: number;
        BASE_URL: string;
    }
}

const DEFAULT_PORT = 3000;
const DEFAULT_BASE_URL = 'http://localhost:3000/';

describe('config', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    describe('PORT', () => {
        afterEach(() => {
            delete process.env.PORT;
        });

        it('should define a default port', () => {
            const { config } = require('../src/config');

            expect(config.PORT).toEqual(DEFAULT_PORT);
        });

        it('should be overridden by an environment variable', () => {
            process.env.PORT = 4000;
            const { config } = require('../src/config');

            expect(config.PORT).toEqual(4000);
        });
    });

    describe('BASE_URL', () => {
        afterEach(() => {
            delete process.env.BASE_URL;
        });

        it('should define a default base url', () => {
            const { config } = require('../src/config');

            expect(config.BASE_URL).toEqual(DEFAULT_BASE_URL);
        });

        it('should be overridden by an environment variable', () => {
            process.env.BASE_URL = 'https://custom.url.com/';
            const { config } = require('../src/config');

            expect(config.BASE_URL).toEqual('https://custom.url.com/');
        });
    });
});
