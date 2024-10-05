import {ReadableStreamResponse} from "../../model/http/readable-stream-response";
import type {RequestHandler} from "@sveltejs/kit";
import {RandomStreamBuilder} from "../../model/random/random-stream-builder";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url); // Create a URL object
    let interval: number
    switch (url.searchParams.get("channel")) {
        case "random-0":
            interval = 1000; break;
        case "random-1":
            interval = 100; break;
    }
    const stream = new RandomStreamBuilder(interval).build(request)

    return new Promise((resolve, reject) => {
        resolve(ReadableStreamResponse.of(stream))
    });
};
