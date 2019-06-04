#!/bin/bash

# ***************************************************************************
# This is an example of extracting card names only to text output.
#
# The report in this case retrieves card names only, then parses that a bit.
# The board example-board contains team member names including the
# @username for each team member. This board has lists for Authors, TEs and
# FPEs.
#
# The report returns this: (pipe is the delimiter)
#   Author Full Name @username|List Name
#
# Since we include the list name in each row, we can use grep to filter for
# one of the lists only. Then we use cut to separate the items by the delimiter.
# Finally, we use a grep regex to extract just the username (looking for @username).
#
# The config for this board looks like this:
#  {
#    "boardkey": "example-board",
#    "board": {
#      "id": "BOARD-ID-HERE",
#      "urlId": "BOARD-URL-ID-HERE",
#      "output": {
#        "outputFormat": "text"
#      },
#      "card_fields": "name,shortUrl",
#      "card_output_format": "\n${card['name']}|${listName}",
#      "list_name_format": "",
#      "empty_list_placeholder": "\nNo members",
#      "card_fields_search": "name,shortUrl,list",
#      "card_output_format_search": "\n${card['name']}|${card['list']['name']}",
#      "lists": [
#        {
#          "key": "authors",
#          "id": "LIST-ID-HERE-AUTHORS",
#          "excludeTryouts": false,
#          "excludeNames": []
#        },
#        {
#          "key": "te",
#          "id": "LIST-ID-HERE-TE",
#          "excludeTryouts": false,
#          "excludeNames": []
#        },
#        {
#          "key": "fpe",
#          "id": "LIST-ID-HERE-FPE",
#          "excludeTryouts": false,
#          "excludeNames": []
#        }
#      ]
#    }
#  }
#
# Call this script like this for example to show only cards in the 'Authors' list:
# $ ./report-card-names-to-text-output.sh "[your-boardkey]" "Authors"
#
# ***************************************************************************

# Save the path to this script. Provides us with path independence.
BASH_SCRIPT_PATH=$(cd `dirname $0` && pwd)

# Check that we received the required command line arguments.
if [[ -z "$1" ]] || [[ -z "$2" ]]; then
    echo "Invalid Syntax. Please use:"
    echo "report-card-names-to-text-output.sh \"[your-boardkey]\" \"Authors\""
    echo ""
    exit -1
fi

# Let's do the work.
node ${BASH_SCRIPT_PATH}/../report.js -r $1 | grep "$2" | cut -d"|" -f1 | egrep -o "@.*"
