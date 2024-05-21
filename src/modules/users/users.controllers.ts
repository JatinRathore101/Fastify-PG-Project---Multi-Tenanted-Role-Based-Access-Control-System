import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";

export function createUserHandler(
    
    request:FastifyRequest<{
        Body: CreateUserBody;
    }>,

    reply:FastifyReply
){

    const {initialUser, ...data} = request.body;

    const roleName = initialUser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER;

    const role = getRoleByName({
        name: roleName,
        applicationId: data.applicationId,
    });
}
