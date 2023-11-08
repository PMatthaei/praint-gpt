import type {Actions} from "@sveltejs/kit";

export const actions: Actions = {
    query: async ({cookies, request}) => {
        const data = await request.formData();
        const message = data.get("message")
        const res = await fetch('https://httpbin.org/post', {
            method: 'POST',
            body: message
        })

        const json = await res.json()
        const result = JSON.stringify(json)
        debugger
        // TODO save data to database
    },
};
