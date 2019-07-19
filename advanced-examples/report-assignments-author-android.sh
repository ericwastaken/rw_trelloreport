#!/bin/bash

BASH_SCRIPT_PATH=$(cd `dirname $0` && pwd)

${BASH_SCRIPT_PATH}/report-card-names-to-text-output.sh android-team-members-text authors | node ${BASH_SCRIPT_PATH}/../search.js -r default --excludeDone --sortbytaskcount-lessfirst -o "./output/author-assignments.html"







