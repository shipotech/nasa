# Alpine is a light weight version
FROM node:lts-alpine

# Can be any name
WORKDIR /app

# Copy files from parent folder (8-nasa) to /app folder
# COPY . .

# All packages depends on this
# Can copy package and lock json files adding asterisk after package word
COPY package.json ./

# Run Client
COPY client/package.json client/
RUN npm run install-client --only=production # Only install production dependencies

# Run Server
COPY server/package.json server/
RUN npm run install-server --only=production

# Copy client folder and run build command
COPY client/ client/
RUN npm run build-docker --prefix client # Build client


COPY server/ server/

# Select "node" user to run the commands (root user is the default)
USER node

CMD [ "npm", "start", "--prefix", "server" ]

# Expose PORT 8000 to make it available outside of the container
EXPOSE 8000