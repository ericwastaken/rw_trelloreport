# RayWenderlich Team Lead Trello Report

## Summary

This tool uses the Trello API to pull out lists of cards in the various RW tutorial phases. This tool is written in JavaScript and requires NodeJS 8.x to run.

You can also run this tool via GitPod which requires you to run it inside your browser.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ericwastaken/rw_trelloreport)

## Author & Support

This tool was created by Eric A. Soto, eric@issfl.com, [www.ericsoto.net](https://www.ericsoto.net/).

For support, contact the author.

## GitPod Script Installation / First Time Setup (This is the preferred setup for most users)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ericwastaken/rw_trelloreport)

GitPod is an easy way to use this tool without needing to download or install anything on your workstation. Simply click on the **Open in GitPod** icon to launch a virtual machine (using Docker) that will allow you to run this tool.

Although GitPod provides everything you need to run this tool, you do need to configure a few items. When you start a GitPod workspace, a script will reset all the config files to sample versions. After GitPod has come up, simply edit the files to contain your details! You can edit these files right inside your GitPod workspace.

> **Note:** When you're done with your GitPod workspace edits, you'll want to come back to the same workspace so that you don't have to repeat the edits! Simply go to your **GitPod Dashboard** to restart any workspaces you created before.

Files to edit:
- **./conf/secrets.json** - add your Trello API Key and Token. (See 'Authentication' below.)
- **./conf/conf.json** - replace the IDs there with those of your Trello Board lists. (See 'Configuration' below including a helper script to quickly get all your List Ids.)

If you plan to use HTML Output, you could also edit if you don't like the defaults:

- **./conf/report-layout.html**.
- **./conf/report-styles.css**.

## Local Script Installation (on your workstation) / First Time Setup

> **Note:** If you're using a GitPod to run this tool, please skip this section. The steps here are handled for you by the GitPod startup process!

Before running this script for the first time, you must take the following actions:

- Verify you have NodeJS 8.x installed (install if necessary).
  - To verify that you have NodeJS you can run `node --version` in your terminal.
- From the root folder of the script files, install all NodeJS modules with `npm i`.
- copy **./conf/secrets-sample.json** to **./conf/secrets.json**. Edit **./conf/secrets.json** to add your Trello API Key and Token. (See 'Authentication' below.)
- copy **./conf/conf-sample.json** to **./conf/conf.json**. Edit **./conf/conf.json** and replace the IDs there with those of your Trello Board lists. (See 'Configuration' below including a helper script to quickly get all your List Ids.)

> Note: **./conf/conf.json** and **./conf/secrets.json** are both excluded from git since this is information unique to you!

If you plan to use HTML Output, you could also edit the following (if you don't like the defaults):

- copy **./conf/report-layout-sample.html** to **./conf/report-layout.html**.
- copy **./conf/report-styles-sample.css** to **./conf/report-styles.css**.

In macOS and Linux you can copy the sample files to your own versions with:
```bash
$ cp ./conf/secrets-sample.json ./conf/secrets.json
$ cp ./conf/conf-sample.json ./conf/conf.json
$ cp ./conf/report-layout-sample.html ./conf/report-layout.html
$ cp ./conf/report-styles-sample.css ./conf/report-styles.css
```

After copying, you may edit both html and css files suit your preferences, or you can use them as-is!

## Authentication

In order for this tool to access 'your Trello boards', please enter an API KEY and TOKEN in **./conf/secrets.json**.

To generate your key and token:

- Login to Trello in your web browser.
- Visit https://trello.com/app-key. This page displays your API KEY.
- From that same page you can generate a token for yourself: "_If you are looking to build an application for yourself, or are doing local testing, you can manually generate a Token._"

Copy both your API KEY and TOKEN to **./conf/secrets.json**.

**CAUTION:** The API KEY and TOKEN must be protected since they allow anyone in control of them with full access to your Trello account! For this reason, the file **secrets.json** is not included in the repository!

## Configuration

Edit **./conf/conf.json** and enter the details on the Board you want to report on.

> **Note:** Other than the various **ids** and the **lists**, the **conf.json** can be used "as is" if it works for you!

The config looks like this:

```
"board": {
  "id": "TRELLO-BOARD-ID",
  "urlId": "TRELLO-BOARD-URL-ID",
  "card_fields": "name,shortUrl,due",
  "card_output_format":
        "\n* ${card['name']} - ${dateString}\n  [View in Trello](${card['shortUrl']})",
  "list_name_format": "\n## ${listName}",
  "empty_list_placeholder": "\n*No tutorials in this phase.*",
  "card_fields_search": "name,shortUrl,due,list",
  "card_output_format_search":
    "\n* ${card['name']} - ${dateString}\n  [View in Trello](${card['shortUrl']}) (${card['list']['name']})",
  "lists": [],
  "output": {}
}
```

You must edit the following keys:

- **id** is the Trello id for the board you'll be reporting from. See "How to find the Board and List IDs" further down in this document.
  - Board id looks something like this: `5242dbcb52hed1ff1752fdac` (note, this id is not real.)
- **urlId** is the Trello Url id for the board you'll be reporting from. See "How to find the Board and List IDs" further down in this document.
  - URL id looks something like this: `a9bcPt5B` (note, this value is not real.)
- **lists** is an array that defines each of the lists you want to output from. See below for the details of that element.

Optionally, you may also edit:

- **card_fields** should come from the Trello API docs. See https://developers.trello.com/v1.0/reference#card-object.
- **card_output_format** is a javascript enabled string that will be used to "output" the details for each card. You use the `${card['fieldName']}` object to otuput field data. You can't output a field that you did not include in **card_fields**.
  - If you include 'due' as one of the API fields, ${dateString} is a special formatted variable provided for you that automatically outputs the string 'due: [due-date-here]' or 'overdue: [due-date-here]'. It's optional if you want to use this. If you want no formatting at all on due date, you can use `${card['due']}` or for a formatted date you can use `${dateFormat(card['due'],'shortDate')}`.
  - If your cards start with one or two numbers and a period you need to escape the card name.
    Change the way you read card name in **card_output_format** from:
    ```javascript
    ${card['name']}
    ```
    To:
    ```javascript
    ${escapeMarkdown(card['name'])}
    ```
- **list_name_format** is a javascript enabled string that is used to "output" the title of each list. You place the list name with `${listName}`.
- **empty_list_placeholder** is output when a list has no cards.
- **card_fields_search** is similar to **card_fields**, these are the fields that will be available in search results.
- **card_output_format_search** is similar to **card_output_format**, these is the format that will be used in search results.
- **output** is used to control the type of output you want. It is further described below.

### Configuring the lists to show

The **lists** array in **conf.json** is an array of the following, repeated once per list that you want to output from (in order of output):

```
{
  "key": "convenience list name 1",
  "id": "TRELLO-LIST-ID-01",
  "excludeTryouts": true,
  "excludeNames": []
}
```
- **key** - (a string) is just a convenience key so that the config is easier to read. It's not actually used anywhere in the code.
- **id** - (a string) this is the id of the list you wish to print card from. See below for a script part of this tool that shows you all your list IDs.
- **excludeTryouts** - (true/false) if the list item has this set to **true**, then any cards for "tryouts" will not output. Otherwise, "tryouts" will output. This is useful for the later phases (edit, fpe, etc) where seeing the tutorial on the board is useful and important.
- **excludeNames** - (an array of strings) if there are any cards that you wish to exclude in the output, enter their names in this array of strings. This is useful to skip printing "label" type cards that are sometimes used in boards.

### Configuring report output

The **output** object in **conf.json** has the following structure:
```
"output": {
      "outputFormat": "html",
      "htmlWrapperPath": "./conf/report-layout.html",
      "htmlCssPath": "./conf/report-styles.css",
      "htmlOutputPath": "./report.html",
      "autoOpenOutput": true
    }
```

- **outputFormat** (html, text) is used to control the output of the report.

In addition, if you use **outputFormat** 'html':

- You *should* use markdown syntax in **card_output_format**, **list_name_format** and **empty_list_placeholder** to achieve good looking html.
- **htmlWrapperPath** (a string file path to a valid html file) this is used for "wrap" the report with a valid html structure. It can be ANY html, but must have `<div id="report"></div>` where you want the report body to output.
- **htmlCssPath** (a string file path to a valid css file) this is used for styling the report. It can be ANY valid CSS. This CSS will be injected into the HTML report. You must have `<style></style>` where you want the css to be injected and this should be inside the `<head></head>` of the HTML.

If you set the above two values only, then the HTML will output to the console. However, there are two more optional settings:

- **htmlOutputPath** (a string file path) this is used as the path for an output file which will be created by this script. Careful, this script silently replaces an existing repot with the same file name!
- **autoOpenOutput** (a boolean) if 'true', then the script will not just output to file, but will perform an `open {otput-file-path}` to cause the file to be opened in your default html handler.

## How to find your Trello Board and List IDs

This tool includes a script `lists.js` that will show you the IDs of all the lists in a board. First, find your **board id**. To do this, in Trello on the board you are interested in, click **show menu** then **more**. Notice you're able to see a **Link to this board**.

That link contains the board id. Links look like this:
> https://trello.com/b/a9bcPt5B

The board id is the last part of the url, **a9bcPt5B** in the example above. (Note, 'a9bcPt5B' is not a real board!)

Now, add this to your **conf.json** under **board**, **urlId**.

To find all the list ids for this board, you would run:

```bash
node lists
```

This will show you details about all the lists in your board.

```
...
 board id: TRELLO-BOARD-ID
list name: Wishlist - High Priority
       id: TRELLO-BOARD-URL-ID

 board id: TRELLO-BOARD-ID
list name: Wishlist
       id: TRELLO-BOARD-URL-ID
...
```
(Of course `TRELLO-BOARD-ID` and `TRELLO-BOARD-URL-ID` will be the proper IDs for your boards/lists.)

Also, take note of the 'board id' and add it to your **conf.json** under **board**, **id**.
(You will need this for the search script).

## Generating a Report

> Note: See the 'Configuration' and 'Authentication' sections above for pre-requisites to being able to run reports.

To generate a report on macOS or Linux, change into the root directory where this tool is installed and type:

```bash
node report

```

On macOS, you can redirect the script's output to the clipboard with:

```bash
node report | pbcopy

```

## Searching for Cards

> Note: See the 'Configuration' and 'Authentication' sections above for pre-requisites to being able to run reports.

To generate a report based on a search, change into the root directory where this tool is installed and type:

```bash
node search "some search string"

```
The above will perform a WHOLE WORD search.

To search for all cards where a specific user is a member:

```bash
node search @johnnyappleseed

```

You can find a username easily in the Trello interface by typing a message to a user with the "@" sign. Note that since Trello usernames are a single string with no whitespace, you don't need to quote these.

You may combine a username search with a string search like this:

```bash
node search "some search string @johnnyappleseed"

```

### Search Operators

It is possible to search for cards with search operators. Search operators help you find specific cards. You can add “-” to a search operator to do a negative search. For example **-has:members** will search for cards with no members.

Borrowing from the [Trello API Docs for Search](https://developers.trello.com/reference#search):

- **\#label** - Returns labeled cards. label: also works.
- **list:name** - Returns cards within the list named “name”. Or whatever you type besides “name”.
- **has:attachments** - Returns cards with attachments. has:description, has:cover, has:members, and has:stickers also work as you would expect.
- **due:day** - Returns cards due within 24 hours. due:week, due:month, and due:overdue also work as expected. You can search for a specific day range. For example, adding due:14 to search will include cards due in the next 14 days. You can also search for due:complete or due:incomplete to search for due dates that are marked as complete or incomplete.
- **created:day** - Returns cards created in the last 24 hours. created:week and created:month also work as expected. You can search for a specific day range. For example, adding created:14 to the search will include cards created in the last 14 days.
- **edited:day** - Returns cards edited in the last 24 hours. edited:week and edited:month also work as expected. You can search for a specific day range. For example, adding edited:21 to the search will include cards edited in the last 21 days.
- **description:**, **checklist:**, **comment:**, and **name:** - Returns cards matching the text of card descriptions, checklists, comments, or names. For example, comment:"FIX IT" will return cards with “FIX IT” in a comment.
- **is:open** and **is:archived** - Returns cards that are either open or archived. Trello returns both types by default.

For instance, you can search for overdue cards:

```bash
node search "due:overdue"

```

Combining Search Operators with username queries, it is then possible to find cards for a specific user, edited in a range (7 days in this example):

```bash
node search "@johnnyappleseed edited:7"

```

Or even overdue cards with a certain member:

```bash
node search "@johnnyappleseed due:overdue"

```

### Sort Operators

It is possible to control the sort of any query with the following:

- **sort:created** - Sorts cards by date created. **sort:edited** and **sort:due** also work as expected.

> **Note:** Sort Operators should not be used with the **--sortbytaskcount** parameter below.

### Multiple Searches

It is possible to perform more than one search in a single report. For example to search for cards that are assigned to several members, you can use:

```bash
node search @johnnyappleseed @donkeykong @joeybagofdoughnuts

```

Note that each of the names above will produce a group of cards in the same report!

It's even possible to combine both strings and member searches in a single report:

```bash
node search @johnnyappleseed "kotlin apprentice" @rosalinda "Tryout"

```

The above example will return several groups of cards that match:
- a group of cards each for the members @johnnyappleseed and @rosalinda
- a group of cards each for the string matches "kotlin apprentice" and "Tryout"

> **Note:** Keyword searches still need to be quoted to avoid being treated as separate searches.

However, the above will return 4 groups of cards. Note how this is different than:

```bash
node search "@johnnyappleseed kotlin apprentice @rosalinda Tryout"

```

The above will return a single group of cards all of which match all the criteria:
- All cards will have both @johhnyappleseed and @rosalinda as members
- All cards will match the strings "kotlin" "apprentice" "Tryout"

### Additional Search Parameters

In addition to multiple search criteria, you can also control how the output is generated with the following parameters.

**Excluding Cards that are Done**

You can exclude cards that are **Done** by passing a parameter.

```bash
node search @johnnyappleseed --excludedone

```

The above returns all cards that match @johnnyappleseed, except those in the **Done** list.

**Sorting by the number of cards returned**

You can ask for the output to be sorted by the number of cards (task count) in each search criteria group. This is only useful if you pass more than one search criteria!

```bash
node search @johnnyappleseed @roaslinda @donkeykong --sortbytaskcount-lessfirst

```

The above example returns all cards that match @johnnyappleseed, @roaslinda and @donkeykong but the order of the result will be by the search group that has *less* cards.

Similarly, you can order by *more cards* first as follows:

```bash
node search @johnnyappleseed @roaslinda @donkeykong --sortbytaskcount-morefirst

```

Please refer to the directory **/advanced-examples/** for some examples of how to use multiple search criteria and search parameters.

What can these be used for? For instance, you can see all FPEs with their current assignments in ascending order (less cards first) to see which FPE is less busy at the moment.

## Platform Note

This has been tested under macOS High Sierra, Linux, NodeJS 8.9.0 and NodeJS 10.15.3. It very likely workds under other versions of macOS, and Windows as well as other NodeJS versions, but I've not tested.

## References

Trello API Documentation:

- API Intro, including authentication details
  - https://trello.readme.io/docs/api-introduction
- The main detailed REST API documentation
  - https://trello.readme.io/reference#introduction

## Wish List

- (Low Effort) Add logic to use a different name for the output of 'search'. Right now, this script shares the output file 'report.html'. Move to 'search.html'.
- (Low Effort) Add a config option and corresponding logic to name the output file using a timestamp. For example something like 'report-20190422-032219.html'.
- (High Effort) When the config is set to HTML output, replace *card_output_format* and *list_name_format* with a more robust template like pug/jade or mustache. This could also consolidate the report-layout.html and report-styles.css into the single file for easier editing. This feature must not affect TEXT output!
- (Medium Effort) Add support for multiple boards in *conf.json* + add a command line to choose which board to report on. If none provided, we can exit with error OR provide a list for input?
- (High Effort / Maybe not even possible) Add an easier way to access API KEY, TOKEN if possible, for the initial configuration.
- (High Effort / Maybe not even possible) Add an easier way to figure out and configure Board Id, Lists Ids during initial configuration.

## Changelog

- v1.1.5
  - Enhanced the **search.js** script to add the user's Full Name in the search results header for **@username** searches.
  - Added details in README.md about **Trello Search Operators** with examples. 
- v1.1.4
  - Added path independence, so that the scripts can be called from any path, yet they still find the ./conf/conf.json properly.
  - Added SORT to the search.js script so that one can sort the results by the number of lines (which in our case is the number of tasks assigned to a person, or the number of tasks that matched a particular search.) Order can be ascending or descending.
  - README.md updated to show examples and discuss **search.js**.
- v1.1.3
  - Tweaks to the README to make it more generic.
  - Implemented GitPod support.
  - Randomized the IDs in the readme and sample files.
- v1.1.2
  - Introduced a new script "search" to allow for a report based on a search string (or a search for cards where a certain user is a member.)
  - Refactored "lists" to use the board url id from the **conf.json** file instead of as a command line input.
- v1.1.1
  - A small patch to resolve an issue where card names that started with numbers would format strange in Markdown/HTML when the card name was the first item in the row. Markdown sees the numbers as markdown and tries to render an OL/LI.
- v1.1.0
  - Follow up release which added support for HTML Output and excluded user config files from the repository for easy updating.
  - Note that this version **still** supports the v1.0.0 config file. As such with this new version , text output should still be produced as it was before, though for HTML output, the config needs to be updated! See the config section of this readme for the needed changes.
- v1.0.0
  - Initial release with support for text output only.
