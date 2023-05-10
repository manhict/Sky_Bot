FROM node:19

# Create app directory
WORKDIR /usr/src/SkyBot

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g npm@latest
RUN npm rebuild
#RUN npm fund

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["node", "boot.js"]
