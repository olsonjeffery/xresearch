const express = require('express');
const parser = require('./ruleset-parser');
const app = express();
const _ = require('lodash');
const fs = require('fs');

data = {};

app.get('/', (req, res) => {
    var indexCompiled = _.template(fs.readFileSync('index_template.html', 'utf8'));
    res.send(indexCompiled( { researchData: data } ));
});
app.use(express.static('public'));
app.listen(3000, () => {
    data = JSON.stringify(parser.getResearch());
    console.log("data is parsed");
});
