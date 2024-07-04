# Start with a base image that has both Python and Node.js
FROM python:3.10

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /usr/src/app

# Upgrade pip and install ortools
RUN pip install --upgrade pip ortools

# Copy package.json files and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Verify ortools installation
RUN python3 -c "import ortools; print('ortools is available')"

# Expose the application port
EXPOSE 3004

# Command to run the application
CMD ["node", "app.js"]
