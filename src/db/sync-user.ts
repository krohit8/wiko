import db from ".";
import { userSync } from "./Schema";

type ClerkUser = {
    id: string;
    displayName: string | null;
    primaryEmail: string  | null;
}

export async function ensureUserExists(clerkUser: ClerkUser): Promise<void>{
    await db
    .insert(userSync)
    .values({
        id:clerkUser.id,
        name:clerkUser.displayName,
        email:clerkUser.primaryEmail
    })
    .onConflictDoUpdate({
        target:userSync.id,
        set:{
            name:clerkUser.displayName,
            email:clerkUser.primaryEmail
        }
    })

}


