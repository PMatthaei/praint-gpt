import {ReadableStreamResponse} from "../../model/http/readable-stream-response";
import type {RequestParamHandler} from "express";
import type {RequestHandler} from "@sveltejs/kit";

const encoder = new TextEncoder();

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url); // Create a URL object
    let interval: number
    switch (url.searchParams.get("channel")) {
        case "random-0":
            interval = 1000; break;
        case "random-1":
            interval = 100; break;
    }
    let intervalTimeout: NodeJS.Timeout;

    const stream = new ReadableStream({
        start(controller) {

            intervalTimeout = setInterval(() => {
                const frequency = Math.random() * 500 + 100; // Random frequency between 100 and 600 Hz
                const duration = Math.random() * 500 + 100; //  between 100 and 600 millisecond duration
                const noteData: Note = {frequency, duration};
                const data = `data: ${JSON.stringify(noteData)}\n\n`;
                controller.enqueue(encoder.encode(data)); // Encode the string to Uint8Array
            }, interval);

        },
        close() {
            clearInterval(intervalTimeout);
        },
        cancel() {
            clearInterval(intervalTimeout);
            console.log('Stream cancelled, client disconnected.');
        }
    });

    return new Promise((resolve, reject) => {
        resolve(ReadableStreamResponse.of(stream))
    });
};
