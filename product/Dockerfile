FROM node:18
WORKDIR /product
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
