// import { logger } from "./utils/logger";
import {migrate} from 'drizzle-orm/node-postgres/migrator'
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";
import { db } from './db';
// console.log('hello world!');

async function gracefulShutdown({
    app,
}: {
    app: Awaited<ReturnType<typeof buildServer>>;
}) {
    await app.close();
}

 async function main() {

    const app = await buildServer();

    await app.listen({
        port:env.PORT,
        host:env.HOST,
    });

    await migrate(db,{
        migrationsFolder:'./migrations'
    });

    // console.log('server is running on port 3000');
    // logger.info('server is running on http:/localhost:3000')

    const signals = ['SIGINT','SIGTERM'];

    logger.debug(env,"using env");
    
    for (const signal of signals) {
        process.on(signal, () => {
            console.log("Got Signal",signal);
            gracefulShutdown({
                app,
            });
        });
      }

 }

 main();