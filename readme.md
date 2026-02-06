## Setup
- Install `docker`
- Copy `.env.sample` to `.env` and adjust the values to your requirements
- Start the containers with `docker compose up -d` and stop with `docker compose stop`
- Open the frontend (by default) on `http://localhost:3000` (or the port you set in the .env file)

## Project structure
- [./bin](bin) Useful bash scripts to execute from the host `bash ./bin/my-script.sh`
- [./docs](docs) A collection of documentation about the project, it's components and whatever comes up useful
- [./app/src/client](app/src/client) The Frontend Code
- [./app/src/server](app/src/server) The Backend Code
- [./app/src/shared](app/src/shared) Shared files that are accessible to both the client and the server via imports

