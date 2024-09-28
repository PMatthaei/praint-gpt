import { sveltekit } from '@sveltejs/kit/vite';
import { ViteDevServer, defineConfig } from 'vite'
import {webSocketServer} from "./server/websocket-server";

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	build: {
		target: 'esnext', // or 'modules'
		outDir: 'build',
		rollupOptions: {
			output: {
				format: 'esm', // Ensures the output is ESM
			},
		},
	},
})
