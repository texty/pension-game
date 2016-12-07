#!/usr/bin/env node

var fs = require("fs");

var minYear = 2014;
var maxYear = 2061;

var both = require('./json/both.json');
var males = require('./json/males.json');
var females = require('./json/females.json');

var result = {};

result.males = toMatrix(males);
result.females = toMatrix(females);
result.both = toMatrix(both);

var jsonContent = JSON.stringify(result);
var jsContent = ";" + 
    "\nwindow.__demographics__ = " + jsonContent + 
    "\n;" +
    "\nwindow.__minYear__ = " + minYear + ";" +
    "\nwindow.__maxYear__ = " + maxYear + ";\n";

fs.writeFileSync('demographics.json', jsonContent);
fs.writeFileSync('demographics.js', jsContent);

console.log('Done - see demographics.json and demographics.js');


function toMatrix(json) {
    var res = [];
    for (var age = 0; age <= 100; age++) {
        res.push(toArray(json[age]));
    }
    return res;
}

function toArray(obj) {
    var res = [];
    for (var y = minYear; y <= maxYear; y++) {
        res.push(+obj[y]);
    }
    return res;
}
