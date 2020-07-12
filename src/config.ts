import * as dotenv from 'dotenv';

const DEFAULT_PORT = 3000;
const DEFAULT_BASE_URL = `http://localhost:${DEFAULT_PORT}/`;
const DEFAULT_DB_PATH = 'src/db/urly.db';

export interface ConfigOptions {
    enableDotEnv?: boolean;
}

const defaultOpts: ConfigOptions = {
    enableDotEnv: true,
};

export const UrlyConfig = (inputOpts?: ConfigOptions) => {
    const opts = Object.assign(defaultOpts, inputOpts || {});

    if (opts.enableDotEnv) {
        dotenv.config();
    }

    const PORT = process.env.PORT || DEFAULT_PORT;
    const BASE_URL = process.env.BASE_URL || DEFAULT_BASE_URL;
    const DB_PATH = process.env.DB_PATH || DEFAULT_DB_PATH;

    return {
        PORT: +PORT,
        BASE_URL,
        DB_PATH,
    };
};
