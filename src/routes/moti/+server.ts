import {ReadableStreamResponse} from "../../model/http/readable-stream-response";

const encoder = new TextEncoder();

export const GET = async () => {
    let intervalTimeout: NodeJS.Timeout;

    const stream = new ReadableStream({
        start(controller) {

            intervalTimeout = setInterval(() => {
                const frequency = Math.random() * 500 + 100; // Random frequency between 100 and 600 Hz
                const duration = Math.random() * 500 + 100; //  between 100 and 600 millisecond duration
                const noteData: Note = {frequency, duration};
                const data = `data: ${JSON.stringify(noteData)}\n\n`;
                controller.enqueue(encoder.encode(data)); // Encode the string to Uint8Array
            }, 2000);

        },
        close() {
            clearInterval(intervalTimeout);
        },
        cancel() {
            clearInterval(intervalTimeout);
            console.log('Stream cancelled, client disconnected.');
        }
    });

    return ReadableStreamResponse.of(stream);
};
