FROM oven/bun:slim

WORKDIR /app


# copy and install dependencies
COPY package.json bun.lockb* ./
RUN bun install

# copy application code
COPY . .

# Set default values. They will be overwritten by docker compose
EXPOSE 3000
CMD ["bun", "run", "start"]