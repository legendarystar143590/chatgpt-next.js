## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only for first time)
npm i

# Configure .env file
NEXT_PUBLIC_SERVER_BASE_URL=https://6997-194-87-199-27.ngrok-free.app/
NEXT_PUBLIC_CLIENT_BASE_URL=https://chat.obsolete.live

# Serve at localhost:3000
npm run dev

# Build for production in the dist/ directory
npm run build
```