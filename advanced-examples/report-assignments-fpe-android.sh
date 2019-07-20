#!/bin/bash

BASH_SCRIPT_PATH=$(cd `dirname $0` && pwd)

${BASH_SCRIPT_PATH}/report-card-names-to-text-output.sh android-team-members-text "FPEs" | node ${BASH_SCRIPT_PATH}/../search.js -r default --excludeDone --sortbytaskcount-lessfirst -o "./output/assignments-fpe.html"

#node ${BASH_SCRIPT_PATH}/../search.js --excludeDone --sortbytaskcount-lessfirst \
#  @vijaysharm \
#  @godfredafful  \
#  @taingmeng  \
#  @namratabandekar  \
#  @darrylbayliss2  \
#  @jenn_bailey  \
#  @victoriagonda5  \
#  @nisrulz  \
#  @aldo291 \
#  @filipbabic4 \
#  @joe_howard





