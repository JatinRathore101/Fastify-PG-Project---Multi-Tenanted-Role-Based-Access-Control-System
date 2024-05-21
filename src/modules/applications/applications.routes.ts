import { FastifyInstance } from "fastify";
import { applications } from './../../db/schema';

export async function applicationRoutes(app: FastifyInstance) {

    app.post('/',{},()=>{});
    
    app.get('/',()=>{});
    
}