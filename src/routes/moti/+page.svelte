<script lang="ts">
    import * as Tone from "tone";
    import {onDestroy, onMount} from "svelte";
    import {Visualizer} from "./visualizer/visualizer";

    let synth: Tone.Synth
    const visualizer = new Visualizer()

    let isMuted = false;
    let eventSource: EventSource;

    function start() {
        Tone.start()
        synth = new Tone.Synth().toDestination();
        const analyser = new Tone.Analyser("waveform", 256);
        synth.connect(analyser);
        visualizer.init(analyser)
        visualizer.start()

        eventSource.onmessage = (message) => {
            const {frequency, duration}: Note = JSON.parse(message.data)
            playNote(frequency, duration)
        };

    }

    function playNote(frequency: number, duration: number) {
        console.log("Playing: ", frequency, duration)
        synth.triggerAttackRelease(frequency, duration);
    }

    function toggleMute() {
        isMuted = !isMuted;
        Tone.getDestination().mute = isMuted;
    }

    onMount(() => {
        eventSource = new EventSource('/moti');

        eventSource.onerror = () => {
            console.error('Error in EventSource connection');
            eventSource.close();
        };

    });

    onDestroy(() => {
        if (synth) {
            synth.disconnect();
        }
        if(eventSource){
            eventSource.close();
        }
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
    <button on:click={start}>Play</button>
    <canvas id="visualizer" width="800" height="300"></canvas>

</div>
