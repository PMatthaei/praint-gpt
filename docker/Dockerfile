# Use the official Node.js image
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the SvelteKit app
RUN npm run build

# Use a lightweight web server to serve the built app
FROM serve:latest

# Copy the build output to the server
COPY --from=builder /app/build /usr/share/serve/public

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "/usr/share/serve/public"]
