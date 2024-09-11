import {toneServer} from "./tone-server.js";

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
        toneServer(server)
		console.log("Started webSocketServer")
	}
}
