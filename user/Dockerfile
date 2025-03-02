FROM node:18
WORKDIR /user
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
