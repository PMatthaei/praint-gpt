# Use the slim Node.js 20 image as a base
FROM node:20.11.1-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the root directory
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from the root directory
COPY .. .

# Build the SvelteKit app
RUN npm run build

# Use a lightweight server image for serving the app
FROM node:20.11.1-slim AS runtime

# Set the working directory
WORKDIR /app

# Copy only the build output from the previous stage
COPY --from=build /app/build ./build

# Install serve for static file serving
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "build/index.js"]
