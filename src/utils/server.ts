import fastify from "fastify";
import { logger } from "./logger";
import { applicationRoutes } from "../modules/applications/applications.routes";

export async function buildServer() {
    const app = fastify({
        // logger: logger
        logger,
    });
    // register plugins
    
    // register routes
    app.register(applicationRoutes,{prefix :"/api/applications"}); // giving error

    return app;
}