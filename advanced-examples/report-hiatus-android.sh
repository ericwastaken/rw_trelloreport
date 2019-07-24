#!/bin/bash

BASH_SCRIPT_PATH=$(cd `dirname $0` && pwd)

echo "Authors"
${BASH_SCRIPT_PATH}/report-card-names-to-text-output.sh android-team-members-text-hiatus "Authors"

echo ""
echo "Tech Editors"
${BASH_SCRIPT_PATH}/report-card-names-to-text-output.sh android-team-members-text-hiatus "Tech Editors"

echo ""
echo "FPEs"
${BASH_SCRIPT_PATH}/report-card-names-to-text-output.sh android-team-members-text-hiatus "FPEs"





