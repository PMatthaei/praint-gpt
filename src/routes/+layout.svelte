<script lang="ts">
    import "../app.css";
    import './styles.css';
    import {page} from "$app/stores";
    import {signOut} from '@auth/sveltekit/client'
</script>

<button aria-controls="default-sidebar" class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        type="button">
    <span class="sr-only">Open sidebar</span>
    <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              fill-rule="evenodd"></path>
    </svg>
</button>

<aside aria-label="Sidebar"
       class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
       id="default-sidebar">
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
            <li>
                {#if $page.data.session?.user}
                    <div class="flex grow flex-col gap-2">
                        <div class="relative w-12 h-12">
                            <object title="Profilbild" data="https://stackoverflow.com/does-not-exist.png" type="image/png">
                                <img class="rounded-full border border-gray-100 shadow-sm"
                                     src="{$page.data.session.user.image}" alt="Profile"/>
                            </object>

                            <div class="absolute top-0 right-0 h-3 w-3 my-1 border-2 border-white rounded-full bg-green-400 z-2"></div>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-800 dark:text-white font-bold text-sm">{$page.data.session.user.name}</span>
                            <span class="text-gray-800 dark:text-white text-xs">{$page.data.session.user.email}</span>
                        </div>
                    </div>
                {/if}
            </li>
            <li>
                {#if $page.data.session?.user}
                    <button type="button"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            on:click={signOut}>
                        Sign out
                        <svg class="w-5 h-5 ml-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 18 15">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"/>
                        </svg>
                    </button>
                {/if}
            </li>

            <li>
                <a aria-current={$page.url.pathname === '/moti' ? 'page' : undefined} class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                   href="/moti">
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M17.316 4.052a.99.99 0 0 0-.9.14c-.262.19-.416.495-.416.82v8.566a4.573 4.573 0 0 0-2-.464c-1.99 0-4 1.342-4 3.443 0 2.1 2.01 3.443 4 3.443 1.99 0 4-1.342 4-3.443V6.801c.538.5 1 1.219 1 2.262 0 .56.448 1.013 1 1.013s1-.453 1-1.013c0-1.905-.956-3.18-1.86-3.942a6.391 6.391 0 0 0-1.636-.998 4 4 0 0 0-.166-.063l-.013-.005-.005-.002h-.002l-.002-.001ZM4 5.012c-.552 0-1 .454-1 1.013 0 .56.448 1.013 1 1.013h9c.552 0 1-.453 1-1.013 0-.559-.448-1.012-1-1.012H4Zm0 4.051c-.552 0-1 .454-1 1.013 0 .56.448 1.013 1 1.013h9c.552 0 1-.454 1-1.013 0-.56-.448-1.013-1-1.013H4Zm0 4.05c-.552 0-1 .454-1 1.014 0 .559.448 1.012 1 1.012h4c.552 0 1-.453 1-1.012 0-.56-.448-1.013-1-1.013H4Z" clip-rule="evenodd"/>
                    </svg>
                    <span class="ml-3">Music Of The Internet</span>
                </a>
            </li>

        </ul>
    </div>
</aside>

<main>
    <slot/>
</main>

<style>
</style>
