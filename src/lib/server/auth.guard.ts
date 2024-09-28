import {redirect} from "@sveltejs/kit";
import type {Session} from "@auth/core/types";
import {env} from "$env/dynamic/private";

export const guard = (session: Session | null): { session: Session | null } => {
    const email = session?.user?.email;
    if(email === null || email === undefined){
        redirect(307, 'auth/signin');
    }
    const isAllowedUser = env.ALLOWED_EMAIL.split(",").includes(email);
    if (!isAllowedUser) {
        redirect(307, 'auth/signin');
    }
    if (session == null) {
        redirect(307, 'auth/signin');
    }

    return {
        session
    };
}
