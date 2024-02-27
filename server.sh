#!/bin/sh

# Install dependencies for UI (to avoid port conflicts)
bun install

# Build the UI (to avoid port conflicts)
bun run build

# Install dependencies for server
cd server
bun install

# Run the server
bun index.ts