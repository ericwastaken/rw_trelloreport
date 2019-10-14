var cheerio = require('cheerio');

global.Promise = require('bluebird');
const request = require('request');

// Imports
const path = require('path');
const ReportFormat = require(path.resolve(__dirname, './lib/ReportFormat.js'));
const HtmlOutput = require(path.resolve(__dirname, './lib/HtmlOutput.js'));
const ConfigHelper = require(path.resolve(__dirname, './lib/ConfigHelper.js'));
const program = require('commander');
const CommandLineHelper = require(path.resolve(
  __dirname,
  './lib/CommandLineHelper.js'
));
const assert = require('chai').assert;

// Aye - there be dragons here. If Carolus changes even a little bit, this entire API 
// falls over.

const DOMAIN = require('./conf/secrets.json').carolus.domain;
const DAYS = require('./conf/secrets.json').carolus.days;
const COOKIE = require('./conf/secrets.json').carolus.cookie;

const url = "https://www.raywenderlich.com/admin/stats/popular_content?search%5Bdomain_id%5D=" + DOMAIN + "&search%5Bcontent_type%5D=3&search%5Bperiod%5D=past_" + DAYS + "_days&search%5Blimit%5D=10&commit=Search"
var headers = {
  'Cookie': COOKIE
};

const options = {
  url: url,
  headers: headers
};

function scrapeList(html) {
  var $ = cheerio.load(html, {normalizeWhitespace: true});
  var content = $('table[class="table is-fullwidth"] tbody tr');
  var titles = [];
  var pageViews = [];
  var links = [];
  var author = [];
  content.each((i, elem) => {
    $('td', elem).each((j, rowContent) => {
      if (j % 4 == 0) {
        var titleString = $(rowContent).text();
        var items = titleString.split(")");
        titles.push(items[1].substr(1));
      }
      if (j % 4 == 1) {
        var views = $(rowContent).text();
        pageViews.push(views);
      }
    })
    $('td a', elem).each((k, linkContent) => {
      var path = linkContent.attribs.href;
      if (!path.includes("/admin/")) {
        links.push("https://www.raywenderlich.com" + path);
      }
    })
  });

  var topLink = links[0];
  request(topLink, (error, response, authorBody) => {
    if (error) {
      console.log("Error getting author of top post: " + error);
      return;
    }
    var $$ = cheerio.load(authorBody);
    var authorContent = $$('span[class="c-content-author__title"] a');
    author = $$(authorContent).text();

    var finalResponse = {
      "article": titles[0],
      "author": author,
      "pageViews": pageViews[0],
      "link": links[0]
    }
  
    console.log(finalResponse);
  });
}

function callback(error, response, body) {
  if (!error) {
    var list = scrapeList(body);
  } else {
    console.log("Error accessing original URL on Carolus: " + error);
  }
}

request(options, callback);