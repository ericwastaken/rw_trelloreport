#!/bin/bash

BASH_SCRIPT_PATH=$(cd `dirname $0` && pwd)

${BASH_SCRIPT_PATH}/report-card-names-to-text-output-username-only.sh android-team-members-text ".*" | node ${BASH_SCRIPT_PATH}/../search.js -r default --onlyDone --sortbytaskcount-lessfirst -o "./output/done-all-roles.html"







