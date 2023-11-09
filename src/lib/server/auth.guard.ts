import {redirect} from "@sveltejs/kit";
import type {Session} from "@auth/core/types";
import {env} from "$env/dynamic/private";

export const guard = (session: Session | null): { session: Session } => {
    if (session?.user?.email !== env.ALLOWED_EMAIL) {
        throw redirect(307, 'auth/signin');
    }
    if (!session) {
        throw redirect(307, 'auth/signin');
    }

    return {
        session
    };
}
