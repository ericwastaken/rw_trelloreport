#!/bin/bash

BASH_SCRIPT_PATH=$(cd `dirname $0` && pwd)

${BASH_SCRIPT_PATH}/report-card-names-to-text-output-username-only.sh android-team-members-text "Tech Editors" | node ${BASH_SCRIPT_PATH}/../search.js -r default --excludeDone --sortbytaskcount-lessfirst -o "./output/assignments-te.html"

#node ${BASH_SCRIPT_PATH}/../search.js --excludeDone --sortbytaskcount-lessfirst \
#  @nbonatsakis \
#  @victoriagonda5 \
#  @sergiodelamocaballero \
#  @tomblank  \
#  @_arunsasi  \
#  @jennparker4  \
#  @pierredegand2  \
#  @sanchezegido \
#  @bhavnathacker2 \
#  @nickwinegar \
#  @fernandosproviero \
#  @pablomateo2 \
#  @pabloamartinezandres \
#  @jasondonmoyer2 \
#  @lancegleason \
#  @nisrulz \
#  @deandjermanovic \
#  @sreekumaran \
#  @amanjeetsingh11 \
#  @tslamic \
#  @abunur \
#  @brunolemgruber1 \
#  @hodgreeley \
#  @ryanburns3 \
#  @zsmb13 \
#  @massimocarli3 \
#  @apavka
