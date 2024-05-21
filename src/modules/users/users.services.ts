import { InferModel, name } from "drizzle-orm";
import { applications, users } from "../../db/schema";
import argon2 from 'argon2'
import { db } from "../../db";

export async function createUser(data: InferModel<typeof users,'insert'>) {
    const hashedPassword = await argon2.hash(data.password);

    const result = await db.insert(users).values({
        ...data, 
        password: hashedPassword,
    }).returning({
        id: users.id,
        email: users.email,
        name: users.name,
        applicationId: applications.id,
    });

    return result[0];    
}