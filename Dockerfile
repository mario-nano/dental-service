FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install


# Bundle app source
COPY . .

EXPOSE 8090

# Use the SIGTERM signal to stop the container
STOPSIGNAL SIGTERM

# Make the entrypoint.sh script executable
RUN chmod +x /usr/src/app/entrypoint.sh

# Run the entrypoint.sh script when the container is stopped
CMD ["/usr/src/app/entrypoint.sh"]
