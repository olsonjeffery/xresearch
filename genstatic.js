const parser = require('./rulesetParser.js');
const _ = require('lodash');
const fs = require('fs');

var data = JSON.stringify(parser.getAllData());
var indexCompiled = _.template(fs.readFileSync('docs/index_template.html', 'utf8'));
var indexTxt = indexCompiled( { allData: data } );
fs.writeFileSync('docs/index.html', indexTxt, 'utf8');
