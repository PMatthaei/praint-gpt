import {redirect} from "@sveltejs/kit";
import type {Session} from "@auth/core/types";
import {ALLOWED_EMAIL} from "$env/static/private";

export const guard = (session: Session | null) => {
    if (session?.user?.email !== ALLOWED_EMAIL) {
        throw redirect(307, 'auth/signin');
    }
    if (!session) {
        throw redirect(307, 'auth/signin');
    }

    return {
        session
    };
}
