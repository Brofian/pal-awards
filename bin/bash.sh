#!/usr/bin/env bash

if [ "$#" -ge "1" ]; then
  echo "Running command inside the container: $*"
  echo "-----------------------------"
  docker compose exec web "$@"
else
  echo "Opening bash in container (exit with Ctrl+D or type \"exit\"):"
  echo "-----------------------------"
  docker compose exec web bash
fi


