import * as dotenv from 'dotenv';
import { initServer } from './server';
import { UrlyDatabaseConnection } from './db/db-connection';

dotenv.config();

try {
    const db = new UrlyDatabaseConnection('src/db/urly.db');
    const app = initServer(db);

    const PORT = process.env.PORT || 3000;

    console.log(`Server started on on port ${PORT}`);

    app.listen(PORT);
} catch (error) {
    console.error(`Encountered error in server: ${error.message}`);
}
