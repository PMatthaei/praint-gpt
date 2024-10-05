import type {StreamBuilder} from "../stream-builder";
import type {ReadableStream} from "node:stream/web";
import type {Client} from "../http/client";
import type {UUID} from "node:crypto";
import {randomUUID} from "node:crypto";

export class RandomStreamBuilder implements StreamBuilder {

    private intervalTimeout: NodeJS.Timeout;
    private encoder = new TextEncoder();

    constructor(private interval: number) {
    }

    private clients: Map<UUID, Client> = new Map<UUID, Client>();

    build(request: Request): ReadableStream {
        return new ReadableStream({
            start: (controller: ReadableStreamController<Uint8Array>): void => {
                this.registerClient(controller);

                this.intervalTimeout = setInterval(() => {
                    const frequency = Math.random() * 500 + 100; // Random frequency between 100 and 600 Hz
                    const duration = Math.random() * 500 + 100; // Random duration between 100 and 600 ms
                    const noteData: Note = {frequency, duration};
                    const data = `data: ${JSON.stringify(noteData)}\n\n`;
                    controller.enqueue(this.encoder.encode(data));
                }, this.interval);
            },
            close: (controller: ReadableStreamController<Uint8Array>): void => {
                clearInterval(this.intervalTimeout);
                const errorMessage = 'The stream was closed. Client was disconnected.'
                console.log(errorMessage);
                controller.close();
            },
            cancel: (controller: ReadableStreamController<Uint8Array>): void => {
                clearInterval(this.intervalTimeout);
                const errorMessage = 'The stream was cancelled. Client was disconnected.'
                console.error(errorMessage);
                controller.error(new Error(errorMessage));
            }
        });
    }

    private registerClient(controller: ReadableStreamDefaultController<Uint8Array> | ReadableByteStreamController) {
        const uuid = randomUUID()
        const client: Client = {
            id: uuid,
            controller: controller
        }
        this.clients.set(uuid, client)

        const event = `event: connections\n\n`;
        const data = `data: ${JSON.stringify(this.clients.size)}\n\n`;
        controller.enqueue(this.encoder.encode(event));
        controller.enqueue(this.encoder.encode(data));
        console.log(`Register client ${client.id}`)
    }
}
