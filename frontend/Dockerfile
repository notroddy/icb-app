# Use Node.js 16 as the base image
FROM node:16-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . /app/

# Expose port 3000 to the host
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
