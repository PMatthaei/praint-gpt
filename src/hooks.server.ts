import {SvelteKitAuth} from "@auth/sveltekit"
import Google from "@auth/core/providers/google";
import {env} from "$env/dynamic/private";

export const handle = SvelteKitAuth({
    secret: env.AUTH_SECRET,
    trustHost: true,
    providers: [
        Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret:  env.GOOGLE_CLIENT_SECRET,
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
