import { initServer } from './server';
import { UrlyDatabaseConnection } from './db/db-connection';
import { UrlyConfig } from './config';

const config = UrlyConfig();

const start = async () => {
    try {
        const db = new UrlyDatabaseConnection(config.DB_PATH);

        await db.init();
        const app = initServer(db);

        const PORT = config.PORT;

        console.log(`Server started on on port ${PORT}`);

        app.listen(PORT);
    } catch (error) {
        console.error(`Encountered error in server: ${error.message}`);
    }
};

start();
