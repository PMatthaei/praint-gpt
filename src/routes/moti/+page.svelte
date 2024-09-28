<script lang="ts">
    import * as Tone from "tone";
    import {onDestroy, onMount} from "svelte";
    import AudioMotionAnalyzer from 'audiomotion-analyzer';

    let synth: Tone.Synth
    let audioMotion: AudioMotionAnalyzer

    let isMuted = false;
    let eventSource: EventSource;

    function start() {


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
        if(isMuted){
            audioMotion.stop();
            audioMotion.volume = 0;
        } else {
            audioMotion.start()
        }
    }

    onMount(() => {
        Tone.start()
        synth = new Tone.Synth().toDestination();

        const container = document.getElementById('audio-motion-container')!!;
        audioMotion = new AudioMotionAnalyzer(container, {
            source: synth.output as AudioNode
        });

        eventSource = new EventSource('/moti');

        eventSource.onerror = () => {
            console.error('Error in EventSource connection');
            eventSource.close();
        };

    });

    onDestroy(() => {
        if(audioMotion){
            audioMotion.destroy();
        }

        if (synth) {
            synth.disconnect();
        }
        if (eventSource) {
            eventSource.close();
        }
    });

</script>

<style>
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

    <div class="flex flex-row gap-4 justify-center">
        <button type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                on:click={toggleMute}>
            {isMuted ? 'Unmute' : 'Mute'}
            {#if isMuted}
                <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.707 4.293a1 1 0 0 0-1.414 1.414l14 14a1 1 0 0 0 1.414-1.414l-.004-.005C21.57 16.498 22 13.938 22 12a9.972 9.972 0 0 0-2.929-7.071 1 1 0 1 0-1.414 1.414A7.972 7.972 0 0 1 20 12c0 1.752-.403 3.636-1.712 4.873l-1.433-1.433C17.616 14.37 18 13.107 18 12c0-1.678-.69-3.197-1.8-4.285a1 1 0 1 0-1.4 1.428A3.985 3.985 0 0 1 16 12c0 .606-.195 1.335-.59 1.996L13 11.586V6.135c0-1.696-1.978-2.622-3.28-1.536L7.698 6.284l-1.99-1.991ZM4 8h.586L13 16.414v1.451c0 1.696-1.978 2.622-3.28 1.536L5.638 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/>
                </svg>

            {:else}
                <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.5 8.43A4.985 4.985 0 0 1 17 12c0 1.126-.5 2.5-1.5 3.5m2.864-9.864A8.972 8.972 0 0 1 21 12c0 2.023-.5 4.5-2.5 6M7.8 7.5l2.56-2.133a1 1 0 0 1 1.64.768V12m0 4.5v1.365a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m1-4 14 14"/>
                </svg>
            {/if}
        </button>

        <button type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                on:click={start}>
            Play
            <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                      clip-rule="evenodd"/>
            </svg>

        </button>
    </div>

    <div id="audio-motion-container"></div>

</div>
