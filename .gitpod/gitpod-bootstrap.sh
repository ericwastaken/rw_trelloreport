#!/bin/bash

echo ""
echo "Bootstrap running..."
echo ""

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

    # Install npm web server
    npm install http-server -g

    # Set the file to indicate that bootstrap has already ran.
    echo "Boostrap ran on $(date)" > .gitpod/gitpod-bootstrap.log
else
    # Skipping
    cat .gitpod/gitpod-bootstrap.log
fi

# Start the web server (in the background)
echo ""
echo "Starting a web server for the './output' directory (backgrounded)."
nohup http-server ./output -c-1 &>/dev/null &
disown
echo "Web server started. You should see a prompt to open a browser tab or to use the preview in GitPod."
echo "Don't see it? No problem. Point a tab in your browser to: $(gp url 8080)"

# User Output
echo ""
echo "Please review the README.md for configuration of this tool so it can report on YOUR Trello boards!"
echo "This tool was created by Eric A. Soto, eric@issfl.com, www.ericsoto.net"
echo ""
