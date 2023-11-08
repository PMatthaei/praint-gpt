import {json} from '@sveltejs/kit'
import {env} from "$env/dynamic/private";

// /api/info GET
export async function GET({event}: any) {
    return json(env)
}
