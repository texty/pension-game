#!/usr/bin/env bash

wget "https://docs.google.com/spreadsheets/d/1qX6JwSWskVaSqI9HPn6MvaCwCXaOSiO9QM2xQnV2PaY/pub?gid=0&single=true&output=csv" -O csv/history.csv
wget "https://docs.google.com/spreadsheets/d/1qX6JwSWskVaSqI9HPn6MvaCwCXaOSiO9QM2xQnV2PaY/pub?gid=1111944176&single=true&output=csv" -O csv/both.csv

rm -r json
mkdir json

csv2json csv/both.csv json/both.json
csv2json csv/males.csv json/males.json
csv2json csv/females.csv json/females.json
csv2json csv/history.csv json/history.json

./combine2jsonjs.js