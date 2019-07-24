#!/bin/bash

BASH_SCRIPT_PATH=$(cd `dirname $0` && pwd)

${BASH_SCRIPT_PATH}/report-card-names-to-text-output-username-only.sh android-team-members-text "Authors" | node ${BASH_SCRIPT_PATH}/../search.js -r default --excludeDone --sortbytaskcount-lessfirst -o "./output/assignments-author.html"







