import type {Actions} from "@sveltejs/kit";
import * as stream from "stream";

export const actions: Actions = {
    connect: async ({ cookies, request }) => {
        const data = await request.formData();
        const res = await fetch('https://httpbin.org/post', {
            method: 'POST',
            body: data.get("json")
        })

        const json = await res.json()
        const result = JSON.stringify(json)
        debugger
        // TODO save data to database
    },
};
