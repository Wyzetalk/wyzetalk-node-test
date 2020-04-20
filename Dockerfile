FROM node:8.11-alpine

# Override the base log level (info).
ENV NPM_CONFIG_LOGLEVEL error

# Copy all local files into the image.
RUN mkdir -p /app
WORKDIR /app
COPY ./ ./

# Install all dependencies of the current project.
RUN yarn install --pure-lockfile --no-cache
RUN yarn cache clean
