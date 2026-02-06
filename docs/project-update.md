# How to update the project

The question of all questions. This file shall be an extensive list on how to update the components of the project:

# client / server containers
- run `./bin/bun.sh upgrade` to update bun inside the containers or remove the old images and rebuild
- run `./bin/bun.sh outdated` to show packages that have newer versions available and should be updated
- run `./bin/bun.sh audit` to check for known security vulnerabilities after updating packages