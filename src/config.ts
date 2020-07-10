import * as dotenv from 'dotenv';

const DEFAULT_PORT = 3000;
const DEFAULT_BASE_URL = `http://localhost:${DEFAULT_PORT}/`;

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;
const BASE_URL = process.env.BASE_URL || DEFAULT_BASE_URL;

export const config = {
    PORT: +PORT,
    BASE_URL,
};
