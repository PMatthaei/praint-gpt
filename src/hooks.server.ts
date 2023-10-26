import {SvelteKitAuth} from "@auth/sveltekit"
import Google from "@auth/core/providers/google";
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from "$env/static/private";
import type {User} from "@auth/core/types";
import type {GoogleProfile} from "@auth/core/providers/google";

export const handle = SvelteKitAuth({
    providers: [
        Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret:  GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: 'openid email https://www.googleapis.com/auth/userinfo.profile'
                }
            },
        })
    ],

})
