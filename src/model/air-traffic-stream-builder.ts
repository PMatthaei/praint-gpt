import type {ReadableStream} from "node:stream/web";
import type {StreamBuilder} from "./stream-builder";

export class AirTrafficStreamBuilder implements StreamBuilder {

    private intervalTimeout: NodeJS.Timeout;
    private encoder = new TextEncoder();

    private interval: number = 10 * 1000

    constructor() {
    }

    build(): ReadableStream {
        return new ReadableStream({
            start: (controller: ReadableStreamController<Uint8Array>): void => {
                this.intervalTimeout = setInterval(() => {
                    fetch("https://www.flightradar24.com/airports/traffic-stats/?airport=muc").then((response) => {
                        response.json().then((json) => {
                            console.log(json.details.stats.arrivals)
                        })
                    })
                    const frequency = Math.random() * 500 + 100; // Random frequency between 100 and 600 Hz
                    const duration = Math.random() * 500 + 100; // Random duration between 100 and 600 ms
                    const noteData: Note = {frequency, duration};
                    const data = `data: ${JSON.stringify(noteData)}\n\n`;
                    controller.enqueue(this.encoder.encode(data)); // Encode the string to Uint8Array
                }, this.interval); // Assuming interval is 1000ms or any other constant
            },
            close: (): void => {
                clearInterval(this.intervalTimeout);
            },
            cancel: (): void => {
                clearInterval(this.intervalTimeout);
                console.log('Stream cancelled, client disconnected.');
            }
        });
    }

}
