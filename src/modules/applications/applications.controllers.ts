import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationBody } from "./applications.schemas";
import { applications } from './../../db/schema';
import { createApplication, getApplications } from "./applications.services";
import { createRole } from "../roles/roles.services";
import { ALL_PERMISSIONS, SYSTEM_ROLES, USER_ROLE_PERMISSIONS } from "../../config/permissions";

export async function createApplicationHandler(
    request: FastifyRequest<{Body: CreateApplicationBody}>,
    reply: FastifyReply
) {
    const {name} = request.body;

    const application = await createApplication({
        name,
    });

    // const superAdminRole = await createRole({
    //     applicationId: application.id,
    //     name: SYSTEM_ROLES.SUPER_ADMIN,
    //     permissions: ALL_PERMISSIONS as unknown as Array<string> // type casting
    // })

    // const applicationUserRole = await createRole({
    //     applicationId: application.id,
    //     name: SYSTEM_ROLES.APPLICATION_USER,
    //     permissions: USER_ROLE_PERMISSIONS
    // })

        const superAdminRolePromise = createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.SUPER_ADMIN,
        permissions: ALL_PERMISSIONS as unknown as Array<string> // type casting
    })

    const applicationUserRolePromise = createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.APPLICATION_USER,
        permissions: USER_ROLE_PERMISSIONS
    })

    const [superAdminRole,applicationUserRole] = await Promise.allSettled([
        superAdminRolePromise,applicationUserRolePromise
    ])

    if(superAdminRole.status === 'rejected'){
        throw new Error('error creating super admin role')
    }

    if(applicationUserRole.status === 'rejected'){
        throw new Error('error creating application user role')
    }

    return {application,
        superAdminRole: superAdminRole.value,
        applicationUserRole: applicationUserRole.value,
    };
}

export async function getApplicationsHandler() {
    return getApplications();
}