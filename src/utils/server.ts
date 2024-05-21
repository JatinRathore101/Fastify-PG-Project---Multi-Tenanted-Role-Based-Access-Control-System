import fastify from "fastify";
import guard from 'fastify-guard'

import { logger } from "./logger";
import { applicationRoutes } from "../modules/applications/applications.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/roles.routes";

import jwt from 'jsonwebtoken';
import { applications } from './../db/schema';

type User = {
    id: string;
    applicationId: string;
    scopes: Array<string>;
}

declare module 'fastify'{
    interface FastifyRequest {
      user: User;
    }
  } 

export async function buildServer() {

    const app = fastify({
        // logger: logger
        logger,
    });

    app.decorateRequest("user", null);

  app.addHook("onRequest", async function (request, reply){
    
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return;
    }

    try {
    
        const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, "secret") as User;

      console.log("user", decoded);

      request.user = decoded;
    } 
    catch (ex) {}

  });

  
  // register plugins
    app.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler: (result, request, reply) => {
      return reply.send("Not Authenticated");
     },
    });

    // register routes
    app.register(applicationRoutes,{prefix :"/api/applications"});
    app.register(usersRoutes,{prefix :"/api/users"});
    app.register(roleRoutes,{prefix :"/api/roles"});

    return app;
}