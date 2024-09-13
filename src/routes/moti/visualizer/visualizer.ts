import * as Tone from "tone";

export class Visualizer {
    private canvas;
    private canvasCtx;
    private analyser: Tone.Analyser
    constructor() {
    }

    init(analyser: Tone.Analyser): void{
        this.analyser = analyser
        this.canvas = document.getElementById('visualizer');
        this.canvasCtx = this.canvas.getContext('2d');
    }

    draw = (): void => {
        if (!this.canvasCtx) return;

        // Get the waveform data from the analyser
        const waveformData = this.analyser.getValue();
        const WIDTH = this.canvas.width;
        const HEIGHT = this.canvas.height;

        // Clear the canvas for each new frame
        this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = 'lime';

        this.canvasCtx.beginPath();

        const sliceWidth = WIDTH / waveformData.length;
        let x = 0;

        // Smooth curve drawing
        for (let i = 0; i < waveformData.length - 1; i++) {
            const v1 = (waveformData[i] + 1) / 2;
            const y1 = v1 * HEIGHT;

            const v2 = (waveformData[i + 1] + 1) / 2;
            const y2 = v2 * HEIGHT;

            const xMid = x + sliceWidth / 2;
            const yMid = (y1 + y2) / 2;

            if (i === 0) {
                this.canvasCtx.moveTo(x, y1);
            } else {
                // Draw a smooth curve from the current point to the next
                this.canvasCtx.quadraticCurveTo(x, y1, xMid, yMid);
            }

            x += sliceWidth;
        }

        // Complete the curve
        this.canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        this.canvasCtx.stroke();

        // Schedule the next frame
        requestAnimationFrame(this.draw);
    }

    start(): void {
        const isInitialized = this.canvasCtx && this.canvas && this.analyser;
        if(!isInitialized){
            console.log("Not initialized")
            return
        }
        // Start the animation loop
        requestAnimationFrame(this.draw);
    }

}
