<script lang="ts">
    import {onMount} from "svelte";
    import type {ActionData} from "../../../.svelte-kit/types/src/routes/connect/$types";
    import {applyAction, enhance} from "$app/forms"
    import {goto} from "$app/navigation";

    let editor = null

    let file = null
    let jsonString = null
    let jsonObject = null

    export let form: ActionData;

    onMount(async () => {
        const editorjs = await import ('@editorjs/editorjs');
        const EditorJs = editorjs.default;
        editor = new EditorJs({
            holder: 'editorjs',
            placeholder: 'Type something...',
            data: {
                time: Date.now(),
                blocks: [],
                version: "2.12.4",
            },
            onChange(api, event) {
                (async () => {
                    jsonObject = await editor.save()
                    jsonString = JSON.stringify(jsonObject)
                })();
            },
            tools: {},
        })
        try {
            await editor.isReady;
            console.log('Editor.js is ready to work!')
            /** Do anything you need after editor initialization */
        } catch (reason) {
            console.log(`Editor.js initialization failed because of ${reason}`)
        }
    })

    $: disable = jsonObject == null || jsonObject.blocks.length === 0
</script>

<svelte:head>
    <title>Connect a Braincell</title>
    <meta content="Connect a Braincell" name="description"/>
</svelte:head>

<form action="?/connect" class="flex flex-col gap-4 h-screen p-4 sm:ml-64"
      use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			editor.blocks.clear()
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	}}
      enctype="multipart/form-data" method="POST">
    <div class="flex items-center justify-center w-full">
        <label class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
               for="dropzone-file">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                     fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"/>
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold"> Click to connect Braincell</span> or drag and drop
                </p>
                {#if file}
                    <p>Selected for upload: {file}</p>
                {/if}
            </div>
            <input bind:value={file} class="hidden" id="dropzone-file" name="file" type="file"/>
        </label>
    </div>

    <div class="flex flex-col grow w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="grow w-full" id="editorjs"></div>
        <input bind:value={jsonString} class="hidden" id="editor-json" name="json" required type="text"/>

        {#if form?.success}
            <p>Successfully connected.</p>
        {/if}

        <div class="flex flex-row justify-center">
            <button class={
                    disable ?
                    "text-gray-500 bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2" :
                    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    } data-tooltip-target="tooltip-default" disabled="{disable}"
                    type="submit"
            >
                <svg aria-hidden="true" class="w-5 h-5 mr-2 text-gray-800 dark:text-white"
                     fill="none" viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 16.5A2.493 2.493 0 0 1 6.51 18H6.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .921-3.182 2.477 2.477 0 0 1 1.875-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 11 3.5m0 13v-13m0 13a2.492 2.492 0 0 0 4.49 1.5h.01a2.467 2.467 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.479 2.479 0 0 0-1.875-3.344A2.5 2.5 0 0 0 13.5 1 2.5 2.5 0 0 0 11 3.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M19 8.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"/>
                </svg>
                Connect Braincell
            </button>
            <div class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700" id="tooltip-default"
                 role="tooltip">
                Tooltip content
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>

    </div>
</form>

