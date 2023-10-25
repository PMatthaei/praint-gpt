<script>
    import {onMount} from 'svelte';
    import "../app.css";
    import './styles.css';
    import logo from '$lib/images/svelte-logo.svg';
    import {page} from "$app/stores";

    let editor

    onMount(async () => {
        const editorjs = await import ('@editorjs/editorjs');
        const EditorJs = editorjs.default;
        editor = new EditorJs({
            holder: 'editorjs',
            placeholder: 'Type something...',
            data: {
                time: Date.now(),
                blocks: [

                ],
                version: "2.12.4",
            },
            tools: {
            },
        })
        try {
            await editor.isReady;
            console.log('Editor.js is ready to work!')
            /** Do anything you need after editor initialization */
        } catch (reason) {
            console.log(`Editor.js initialization failed because of ${reason}`)
        }
    })

</script>


<button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
    <span class="sr-only">Open sidebar</span>
    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
    </svg>
</button>

<aside id="default-sidebar"
       class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
       aria-label="Sidebar">
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
            <li>
                <a
                   class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group">
                    <img class="h-10 w-auto" src="{logo}" alt="Sveltekit - Prain">
                    <span class="ml-4 text-2xl font-bold">Prain</span>
                </a>
            </li>
            <li>
                <a href="/connect" aria-current={$page.url.pathname === '/connect' ? 'page' : undefined}
                   class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 1v16M1 9h16"/>
                    </svg>
                    <span class="ml-3">Build Braincell</span>
                </a>
            </li>

            <li>
                <a href="/query" aria-current={$page.url.pathname === '/query' ? 'page' : undefined}
                   class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
                    </svg>
                    <span class="ml-3">Query Braincell</span>
                </a>
            </li>

        </ul>
    </div>
</aside>

<main>
    <slot />
</main>

<style>

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
    }

    footer a {
        font-weight: bold;
    }

    @media (min-width: 480px) {
        footer {
            padding: 12px 0;
        }
    }
</style>
