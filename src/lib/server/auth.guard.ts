import {redirect} from "@sveltejs/kit";
import type {Session} from "@auth/core/types";
import {env} from "$env/dynamic/private";

export const guard = (session: Session | null): { session: Session | null } => {
    if (session?.user?.email !== env.ALLOWED_EMAIL) {
        redirect(307, 'auth/signin');
    }
    if (session == null) {
        redirect(307, 'auth/signin');
    }

    return {
        session
    };
}
