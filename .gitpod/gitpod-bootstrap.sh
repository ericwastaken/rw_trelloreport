#!/bin/bash

if [[ ! -f .gitpod/gitpod-bootstrap.log ]]; then
    # Bootstrap has not run, so we do it!

    # Ensure dependencies are updated
    echo "Updating dependencies..."
    npm i

    # Copy the configs to user versions that the user will edit
    echo "copying sample configs to versions you can edit..."
    cp ./conf/secrets-sample.json ./conf/secrets.json
    cp ./conf/conf-sample.json ./conf/conf.json
    cp ./conf/report-layout-sample.html ./conf/report-layout.html
    cp ./conf/report-styles-sample.css ./conf/report-styles.css

    # Set the file to indicate that bootstrap has already ran.
    echo "Boostrap ran on $(date)" > .gitpod/gitpod-bootstrap.log
else
    # Skipping
    cat .gitpod/gitpod-bootstrap.log
fi

# User Output
echo "Please review the README.md for configuration of this tool so it can report on YOUR Trello boards!"
