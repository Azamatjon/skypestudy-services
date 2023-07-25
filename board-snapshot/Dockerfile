# stage1 as builder
FROM node:slim as builder

WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY *.json ./
COPY ./src ./src/

RUN npm run build

FROM node:slim as production-build

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    apt-get install chromium -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# FROM public.ecr.aws/lambda/nodejs:14.2022.09.09.11
# Create working directory
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./

# Install NPM dependencies for function
RUN npm ci

# Copy from the stahg 1
COPY --from=builder /usr/src/app/dist /usr/src/app/dist/

EXPOSE 3000
CMD ["node", "dist/index.js"]
