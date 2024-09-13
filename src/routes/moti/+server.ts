export const GET = async () => {
    let intervalTimeout: NodeJS.Timeout;

    const stream = new ReadableStream({
        start(controller) {

            intervalTimeout = setInterval(() => {
                const frequency = Math.random() * 500 + 100; // Random frequency between 100 and 600 Hz
                const duration = Math.random() * 500 + 100; //  between 100 and 600 millisecond duration
                const noteData: Note = {frequency, duration};
                controller.enqueue(`data: ${JSON.stringify(noteData)}\n\n`);
            }, 2000);

            controller.close = () => {
                clearInterval(intervalTimeout);
            };
        },
        cancel() {
            clearInterval(intervalTimeout);
            console.log('Stream cancelled, client disconnected.');
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};
