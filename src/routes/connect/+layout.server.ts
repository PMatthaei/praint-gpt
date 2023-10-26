import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import {guard} from "$lib/auth.guard";

export const load : LayoutServerLoad= async (event) => {
    const session = await event.locals.getSession();
    return guard(session)
};