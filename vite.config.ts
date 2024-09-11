import { sveltekit } from '@sveltejs/kit/vite';
import { ViteDevServer, defineConfig } from 'vite'
import {webSocketServer} from "./server/websocket-server";

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
})
