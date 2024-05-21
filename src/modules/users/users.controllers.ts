import { FastifyReply, FastifyRequest } from "fastify";
import { AssignRoleToUserBody, CreateUserBody, LoginBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import { assignRoleToUser, createUser, getUserByEmail, getUsersByApplication } from "./users.services";
import jwt from "jsonwebtoken";
import { logger } from "../../utils/logger";

export async function createUserHandler(
    
    request:FastifyRequest<{
        Body: CreateUserBody;
    }>,

    reply:FastifyReply
){

    const {initialUser, ...data} = request.body;

    // console.log({initialUser});

    const roleName = initialUser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER;

    // console.log({roleName});
    
    if(roleName === SYSTEM_ROLES.SUPER_ADMIN){
        const appUsers = await getUsersByApplication(data.applicationId);
        
        if(appUsers.length>0){
            return reply.code(400).send({
                message:'application already has super admin user',
                extensions:{
                    code:"APPLICATION_ALREADY_SUPER_USER",
                    applicationId: data.applicationId,
                },
            });
        }
    }
    
    const role = await getRoleByName({
        name: roleName,
        applicationId: data.applicationId,
    });

    // console.log({role})

    if(!role){
        return reply.code(404).send({
            message:'role not found'
        });
    }
    
    try {
        const user = await createUser(data);

        await assignRoleToUser({
            userId: user.id,
            roleId: role.id,
            applicationId: data.applicationId
        });

    } catch (error) {
        
    }
}

export async function loginHandler(request: FastifyRequest<{Body: LoginBody;}>,reply: FastifyReply) {
    const {applicationId, email, password} = request.body;

    const user = await getUserByEmail({
        applicationId,
        email,
    });
    
    if(!user){
        return reply.code(400).send({
            message:'invalid email or password'
        });
    }

    // return user;
    
    const token = jwt.sign({
        id: user.id,
        applicationId,
        email,
        scopes: user.permissions
    },'secret'); // setup proper signing key

    return {token};

}

export async function assignRoleToUserHandler(
    request: FastifyRequest<{Body: AssignRoleToUserBody;}>,
    reply: FastifyReply
) {
    
    const {userId, roleId, applicationId} = request.body;

    // const result = await assignRoleToUser({
    //     userId,
    //     applicationId,
    //     roleId
    // });

    // return result;

    try {
        const result = await assignRoleToUser({
            userId,
            applicationId,
            roleId
        });
    
        return result;
    } catch (ex) {
        logger.error(ex,'error in assigning role to user');

        return reply.code(400).send({
            message: 'ERROR: could not assign role to user'
        });
    }

}
