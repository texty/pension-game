#!/usr/bin/env bash

rm -r json
mkdir json

csv2json csv/both.csv json/both.json
csv2json csv/males.csv json/males.json
csv2json csv/females.csv json/females.json

./combine2json.js