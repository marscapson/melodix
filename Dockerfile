# Use Node.js as the base image
FROM node:18-alpine

# Create and set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]
