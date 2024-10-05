<script lang="ts">
    import * as Tone from "tone";
    import {onDestroy, onMount} from "svelte";
    import AudioMotionAnalyzer from 'audiomotion-analyzer';
    import {Extensions} from "../../model/core/extensions";
    import checkNotNull = Extensions.checkNotNull;
    import rngImage from '$lib/images/channel-cards/rng-card.png';
    import randomColor = Extensions.randomTailwindBackgroundColor;

    const channels: Channel[] = Array(10).fill(
        {
            label: "Random",
            description: "Welcome to Random Tunes! Enjoy a continuous stream of random notes, perfect for any mood or moment.",
            img: rngImage,

            uri: "random",

            style: {
                class: "random",
                backgroundColor: "bg-pink-100",
                backgroundColorHover: "hover:bg-blue-400",
                textColor: "text-black",
                textColorColorHover: "text-black"
            },
        },
    ).map((item, index) => ({
        ...item,
        label: `${item.label}-${index}`,
        uri: `${item.uri}-${index}`,
        style: {
            ...item.style,
            class: `${item.class}-${index}`,
            backgroundColor: randomColor()
        }
    }))
    let activeChannel: Channel | undefined

    let synth: Tone.Synth | undefined
    let audioMotion: AudioMotionAnalyzer | undefined

    let isMuted = false;
    let hasStarted = false;
    let channelSource: EventSource | undefined;

    let errorMessage: string | undefined;

    const startChannel = () => {
        hasStarted = true

        channelSource?.close()
        if(!activeChannel){
            throw new Error("No active channel.")
        }

        channelSource = new EventSource(`/moti?channel=${activeChannel.uri}`);

        channelSource.onmessage = (message) => {
            const {frequency, duration}: Note = JSON.parse(message.data)
            playNote(frequency, duration)
        };

        channelSource.onerror = (error: Event) => {
            console.error(error);
            channelSource?.close();
        };

        channelSource.addEventListener('connections', updateConnections);
    }

    const updateConnections = (event: Event) => {
        console.log(event)
    }

    const stopChannel = () => {
        channelSource?.close()
        synth?.triggerRelease()
        hasStarted = false
    }

    const playNote = (frequency: number, duration: number) => {
        synth?.triggerAttackRelease(frequency, duration);
    }

    const toggleMute = () => {
        isMuted = !isMuted;
        Tone.getDestination().mute = isMuted;
        if (isMuted) {
            audioMotion ? audioMotion.volume = 0 : undefined;
        } else {
            audioMotion?.start()
        }
    }

    const setChannel = (channel: Channel) => {
        activeChannel = channel
        audioMotion ? audioMotion.gradient = `${channel.label}-gradient` : undefined
        if(hasStarted){
            startChannel()
        }
    };

    onMount(() => {
        Tone.start()
        synth = new Tone.Synth().toDestination();

        const container = checkNotNull(document.getElementById('audio-motion-container'));
        audioMotion = new AudioMotionAnalyzer(container, {
            source: synth.output as AudioNode,
            overlay: true,
            showBgColor: false,
            colorMode: 'gradient',
            showScaleX: false,
            mode: 4,
            roundBars: true
        });

        channels.forEach(channel => {
            const element = document.querySelector(`.channel-${channel.style.class}`);
            const styles = element ? window.getComputedStyle(element) : undefined;
            const color = styles?.getPropertyValue("background-color") ?? "#000"
            audioMotion?.registerGradient(`${channel.label}-gradient`, {
                bgColor: '#111',
                dir: 'h',
                colorStops: [
                    color,
                ]
            });
        })

    });

    onDestroy(() => {
        audioMotion?.destroy();
        synth?.disconnect();
        channelSource?.close();
    });

</script>

<style>
    #audio-motion-container {
        border-radius: 25px;
        background-color: #212121;
    }
    .channel-card-img {
        height: 200px;
        width: 100%;
        object-fit: cover;
    }
</style>

<svelte:head>
    <title>The Music Of The Internet</title>
    <meta content="The Music Of The Internet" name="description"/>
</svelte:head>

<div class="flex flex-col gap-4 h-screen p-4 sm:ml-64">

    <div class="hidden absolute animate-fade-in z-10 rounded-lg min-w-80 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
        <p class="font-bold">Channel not available</p>
        <p>{ errorMessage ?? '' }</p>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
    </div>

    <div class="flex flex-row relative">
        <div id="audio-motion-container" class="animate-fade-in flex-grow">

        </div>
        <div class="absolute flex-row flex bottom-0 left-1/2">
            <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clip-rule="evenodd"/>
            </svg>
            <span class="text-white font-bold">0</span>
        </div>

    </div>


    <div class="flex flex-row gap-4 justify-center">
        {#if activeChannel}
            <button type="button"
                    class="animate-fade-in {activeChannel.style.textColor} {activeChannel.style.backgroundColor} {activeChannel.style.backgroundColorHover} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    on:click={toggleMute}>
                {isMuted ? 'Unmute' : 'Mute'}
                {#if isMuted}
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.707 4.293a1 1 0 0 0-1.414 1.414l14 14a1 1 0 0 0 1.414-1.414l-.004-.005C21.57 16.498 22 13.938 22 12a9.972 9.972 0 0 0-2.929-7.071 1 1 0 1 0-1.414 1.414A7.972 7.972 0 0 1 20 12c0 1.752-.403 3.636-1.712 4.873l-1.433-1.433C17.616 14.37 18 13.107 18 12c0-1.678-.69-3.197-1.8-4.285a1 1 0 1 0-1.4 1.428A3.985 3.985 0 0 1 16 12c0 .606-.195 1.335-.59 1.996L13 11.586V6.135c0-1.696-1.978-2.622-3.28-1.536L7.698 6.284l-1.99-1.991ZM4 8h.586L13 16.414v1.451c0 1.696-1.978 2.622-3.28 1.536L5.638 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/>
                    </svg>

                {:else}
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15.5 8.43A4.985 4.985 0 0 1 17 12c0 1.126-.5 2.5-1.5 3.5m2.864-9.864A8.972 8.972 0 0 1 21 12c0 2.023-.5 4.5-2.5 6M7.8 7.5l2.56-2.133a1 1 0 0 1 1.64.768V12m0 4.5v1.365a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m1-4 14 14"/>
                    </svg>
                {/if}
            </button>
            {#if !hasStarted}
                <button type="button"
                        disabled="{activeChannel === undefined}"
                        class="animate-fade-in {activeChannel.style.textColor} {activeChannel.style.backgroundColor} {activeChannel.style.backgroundColorHover} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        on:click={startChannel}>
                    Play
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                              d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                              clip-rule="evenodd"/>
                    </svg>
                </button>
            {:else}
                <button type="button"
                        disabled="{activeChannel === undefined}"
                        class="animate-fade-in {activeChannel.style.textColor} {activeChannel.style.backgroundColor} {activeChannel.style.backgroundColorHover} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        on:click={stopChannel}>
                    Stop
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                         viewBox="0 0 24 24">
                        <path d="M7 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Z"/>
                    </svg>

                </button>
            {/if}
        {:else}
            <h4>Start listening to one of the following channels</h4>
        {/if}
    </div>

    <h2 class="text-2xl">Channels ({channels.length}): </h2>

    <div class="flex flex-row flex-wrap gap-6 justify-center overflow-auto">
        {#each channels as channel}
            <div class="animate-fade-in md:w-[calc(33%-1.5rem)] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <img class="channel-card-img rounded-t-lg" src="{channel.img}" alt=""/>
                <div class="p-5">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {channel.label}
                    </h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {channel.description}
                    </p>
                    <button on:click={()=>setChannel(channel)}
                            class="{`channel-${channel.style.class}`} {channel.style.textColor} {channel.style.backgroundColor} {channel.style.backgroundColorHover}
                             inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800">
                        Listen
                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>
