import * as dotenv from 'dotenv';
import { app } from './server';

dotenv.config();

const PORT = process.env.PORT || 3000;

console.log(`Server started on on port ${PORT}`);

app.listen(PORT);
