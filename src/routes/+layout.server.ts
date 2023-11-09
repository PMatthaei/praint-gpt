import type {LayoutServerLoad} from './$types';
import {guard} from "$lib/server/auth.guard";
import type {Session} from "@auth/core/types";

// Protect all routes via guard function
export const load: LayoutServerLoad = async (event):Promise<{session: Session}> => {
    const session = await event.locals.getSession();
    return guard(session)
};
