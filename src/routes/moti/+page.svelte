<script lang="ts">
    import * as Tone from "tone";
    import {onDestroy, onMount} from "svelte";
    import {io} from 'socket.io-client'

    Tone.start()
    const synth = new Tone.Synth().toDestination();
    const analyser = new Tone.Analyser("waveform", 256);
    synth.connect(analyser);

    const socket = io()

    let canvas;
    let canvasCtx;
    let isMuted = false;

    function playNote(frequency, duration) {
        console.log("Playing: ", frequency, duration)
        synth.triggerAttackRelease(frequency, duration);
    }

    function toggleMute() {
        isMuted = !isMuted;
        Tone.getDestination().mute = isMuted;
    }

    function drawWaveform() {
        requestAnimationFrame(drawWaveform);

        // Get the waveform data from the analyser
        const waveformData = analyser.getValue();
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        // Clear the canvas for each new frame
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'lime';

        canvasCtx.beginPath();

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
                canvasCtx.moveTo(x, y1);
            } else {
                // Draw a smooth curve from the current point to the next
                canvasCtx.quadraticCurveTo(x, y1, xMid, yMid);
            }

            x += sliceWidth;
        }

        // Complete the curve
        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
    }

    onMount(() => {
        canvas = document.getElementById('visualizer');
        canvasCtx = canvas.getContext('2d');

        socket.on('note', (message) => {
            const {frequency, duration} = JSON.parse(message)
            playNote(frequency, duration)
        })

        drawWaveform();

    });

    onDestroy(() => {
        Tone.disconnect(synth)
    });
</script>

<style>
    canvas {
        display: block;
        margin: 20px auto;
        background-color: black;
    }
</style>

<svelte:head>
    <title>The Music Of The Internet</title>
    <meta content="The Music Of The Internet" name="description"/>
</svelte:head>

<div class="flex flex-col gap-4 h-screen p-4 sm:ml-64">
    <span>Channels: </span>
    <div class="flex flex-row">
        <button class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            Sound Of iteratec
        </button>

        <button class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
            Stock Exchange
        </button>

        <button class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
            Nature
        </button>
        </div>

    <button on:click={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
    <canvas id="visualizer" width="800" height="300"></canvas>

</div>
