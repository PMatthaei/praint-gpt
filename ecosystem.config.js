module.exports = {
    apps: [
        {
            name: 'prain-app',
            script: 'build/index.js', // Replace with the entry point of your SvelteKit app or server
            instances: 1,           // You can increase this for a clustered setup
            exec_mode: 'fork',      // You can change this to 'cluster' if needed
            node_args: '-r dotenv/config',
            env: {                  // Environment variables for production
                NODE_ENV: 'production',
                PORT: 8080            // Set the port your app will run on
            },
            env_development: {      // Environment variables for development
                NODE_ENV: 'development',
                PORT: 3000            // Different port for development environment
            }
        }
    ]
};
