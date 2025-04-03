FROM node:18-latest

WORKDIR /usr/src/app

COPY package*.json .

# Install build dependencies for canvas, including pangocairo, and fix missing packages
RUN apt-get update && apt-get install -y --no-install-recommends --fix-missing \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config \
    libpangocairo-1.0-dev

# Set PKG_CONFIG_PATH - while the previous installation should have set the path, it's good practice to include this here
ENV PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig

RUN npm install

COPY . .

CMD [ "node", "server.js" ]