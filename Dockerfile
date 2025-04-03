FROM node:22-latest

WORKDIR /usr/src/app

COPY package*.json ./

# Add these lines to clear node_modules and package-lock.json before installing
RUN rm -rf node_modules
RUN rm package-lock.json || true

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
