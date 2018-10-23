FROM node
WORKDIR /app
COPY package.json .
RUN npm install
ADD . /app
CMD ["node", "docker23.js"]
