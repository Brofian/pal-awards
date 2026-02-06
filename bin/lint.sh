#!/usr/bin/env bash

docker compose exec -T web bunx eslint . \
  && echo "Everything looks fine, good job!"