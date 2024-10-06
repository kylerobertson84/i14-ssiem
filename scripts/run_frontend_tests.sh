#!/bin/bash
# Script to run frontend tests using Docker Compose

docker-compose run frontend-tests npm test -- --json --outputFile=test-results.json --verbose
