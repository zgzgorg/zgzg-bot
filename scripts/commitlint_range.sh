#!/usr/bin/env bash

set -o errexit
#set -o nounset

#For debugging purposes
# set -o xtrace
# set -o pipefail

git log "$(git rev-list --max-parents=0 HEAD)" "$(git rev-parse HEAD)" --pretty=%B | ./node_modules/.bin/commitlint