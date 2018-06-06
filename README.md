# RayWenderlich Team Lead Trello Report

## Summary

This tool uses the Trello API to pull out lists of cards in the various RW tutorial phases.

## References

Trello API Documentation:

- API Intro, including authentication details
  - https://trello.readme.io/docs/api-introduction
- The main detailed REST API documentation
  - https://trello.readme.io/reference#introduction
  
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
  "card_fields": "name,shortUrl,due",
  "card_otput_format":
    "${card['name']} - Due: ${dateFormat(card['due'],'shortDate')}\n${card['shortUrl']}",
  "list_name_format": "\n${listName}",
  "empty_list_placeholder": "No tutorials in this phase.",
  "lists": []
}
```
- **card_fields** should come from the Trello API docs. See https://developers.trello.com/v1.0/reference#card-object.
- **card_output_format** is a javascript enabled string that will be used to "print" the details for each card. You use the `card['fieldName']` object to otuput field data. You can't output a field that you di not include in **card_fields**.
- **list_name_format** is a javascript enabled string that is used to "print" the title of each list. You place the list name by referring to the `listName` variable.
- **empty_list_placeholder** is output when a list has no cards.
- **lists** is an array that defines each of the lists you want to print from. See below for the pieces of that object.

The **lists** array is an array of the following object, repeated once per list that you want to print from (in order of output):

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
- **excludeTryouts** - (true/false) if the list item has this set to **true**, then any cards for "tryouts" will not output. Otherwise, "tryouts" will output. This is useful for the later phases (edit, fpe, etc) where seein the tutorial on the board is useful and important.
- **excludeNames** - (an array of strings) if there are any cards that you don't want to include, enter their names in this array of strings. This is useful to skip printing "label" type cards that are sometimes used in boards.

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
