# RayWenderlich Team Lead Trello Report

## Summary

This tool uses the Trello API to pull out lists of cards in the various RW tutorial phases. This tool is written in JavaScript and requires NodeJS 8.x to run.

## Author & Support

This tool was created by Eric A. Soto, eric@issfl.com, [www.ericsoto.net](https://www.ericsoto.net/).

For support, contact the author.
  
## Script Installation / First Time Setup

Before running this script for the first time, you must take the following actions:

- Verify you have NodeJS 8.x installed (install if necessary).
  - To verify that you have NodeJS you can run `node --version` in your terminal. 
- From the root folder of the script files, install all NodeJS modules with `npm i`.
- Copy **./conf/secrets-sample.json** to **./conf/secrets.json**. Edit **./conf/secrets.json** to add your Trello API Key and Token. (See 'Authentication' below.)
- Copy **./conf/conf-sample.json** to **./conf/conf.json**. Edit **./conf/conf.json** and replace the IDs there with those of your Trello Board lists. (See 'Configuration' below including a helper script to quickly get all your List Ids.)

> Note: **./conf/conf.json** and **./conf/secrets.json** are both excluded from git since this is information unique to you!

If you plan to use HTML Output, you will also want to:

- Copy **./conf/report-layout-sample.html** to **./conf/report-layout.html**.
- Copy **./conf/report-styles-sample.css** to **./conf/report-styles.css**. 

After copying, edit both html and css files suit your preferences! 

## Authentication

In order for this tool to access 'your Trello boards', please enter an API KEY and TOKEN in **./conf/secrets.json**.

To generate your key and token:

- Login to Trello in your web browser.
- Visit https://trello.com/app-key. This page displays your API KEY.
- From that same page you can generate a token for yourself: "_If you are looking to build an application for yourself, or are doing local testing, you can manually generate a Token._"

**CAUTION:** The API KEY and TOKEN must be protected since they allow anyone in control of them with full access to your Trello account! 

## Configuration

Please edit **./conf/conf.json** and enter the details on the Board you want to report on.

The config looks like this:

```
"board": {
  "output": {},
  "card_fields": "name,shortUrl,due",
  "card_otput_format":
        "\n* ${card['name']} - ${dateString}\n  [View in Trello](${card['shortUrl']})",
  "list_name_format": "\n## ${listName}",
  "empty_list_placeholder": "\n*No tutorials in this phase.*",
  "lists": []
}
```
- **output** is used to control the type of output you want. It is further described below. 
- **card_fields** should come from the Trello API docs. See https://developers.trello.com/v1.0/reference#card-object.
- **card_output_format** is a javascript enabled string that will be used to "output" the details for each card. You use the `${card['fieldName']}` object to otuput field data. You can't output a field that you did not include in **card_fields**.
  - If you include 'due' as one of the API fields, ${dateString} is a special formatted variable provided for you that automatically outputs the string 'due: [due-date-here]' or 'overdue: [due-date-here]'. It's optional if you want to use this. If you want no formatting at all on due date, you can use `${card['due']}` or for a formatted date you can use `${dateFormat(card['due'],'shortDate')}`. 
- **list_name_format** is a javascript enabled string that is used to "output" the title of each list. You place the list name with `${listName}`.
- **empty_list_placeholder** is output when a list has no cards.
- **lists** is an array that defines each of the lists you want to output from. See below for the details of that element.

The **lists** array is an array of the following, repeated once per list that you want to output from (in order of output):

```
{
  "key": "outline",
  "id": "5562debb52fed1ff1792fded",
  "excludeTryouts": true,
  "excludeNames": []
}
``` 
- **key** - (a string) is just a convenience key so that the config is easier to read. It's not actually used anywhere in the code.
- **id** - (a string) this is the id of the list you wish to print card from. See below for a script part of this tool that shows you all your list IDs.
- **excludeTryouts** - (true/false) if the list item has this set to **true**, then any cards for "tryouts" will not output. Otherwise, "tryouts" will output. This is useful for the later phases (edit, fpe, etc) where seeing the tutorial on the board is useful and important.
- **excludeNames** - (an array of strings) if there are any cards that you wish to exclude in the output, enter their names in this array of strings. This is useful to skip printing "label" type cards that are sometimes used in boards.

The **output** object has the following structure:
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

**How to find the List IDs**

This tool has a script `./lists.js` that will show you the IDs of all the lists in a board. First, find your **board id**. To do this, in Trello on the board you are interested in, click **show menu** then **more**. Notice you're able to see a **Link to this board**. 

That link contains the board id. Links look like this:
```
https://trello.com/b/d9smHs4A
```

The board id is the last part of the url, **d9smHs4A** in the example above.

To find all the list ids for this board, you would run:

```javascript
./lists.js d9smHs4A
```    

This will show you details about all the lists in your board.

```

...

list name: Wishlist - High Priority
       id: 5ae1312047efa03805e648a1

list name: Wishlist
       id: 55bb8393c6f63f54c0ac81e9

...

```

## Generating a Report

> Note: See the 'Configuration' and 'Authentication' sections above for pre-requisites to being able to run reports.

To generate a report on macOs or Linux, change into the root directory where this tool is installed and type:

```bash
./reports.js

```

On macOs, you can redirect the script's output to the clipboard with:

```bash
./reports.js | pbcopy

```

To generate a report on Windows, change into the root directory where this tool is installed and type:
```
node report.js
```

## Platform Note

This has been tested under macOS High Sierra and NodeJS 8.9.0. It very likely workds under other versions of macOS, versions of Linux and Windows as well as other NodeJS versions, but I've not tested.

## References

Trello API Documentation:

- API Intro, including authentication details
  - https://trello.readme.io/docs/api-introduction
- The main detailed REST API documentation
  - https://trello.readme.io/reference#introduction

## Changelog

- v1.1.0
  - Follow up release which added support for HTML Output and excluded user config files from the repository for easy updating.
  - Note that this version **still** supports the v1.0.0 config file. As such with this new version , text output should still be produced as it was before, though for HTML output, the config needs to be updated! See the config section of this readme for the needed changes.
- v1.0.0
  - Initial release with support for text output only.
