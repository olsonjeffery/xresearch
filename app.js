const express = require('express');
const parser = require('./ruleset-parser');
const app = express();
const _ = require('lodash');
const fs = require('fs');

data = {};

app.get('/', (req, res) => {
    var indexCompiled = _.template(fs.readFileSync('docs/index_template.html', 'utf8'));
    res.send(indexCompiled( { allData: data } ));
});
app.use(express.static('docs'));
app.use('src', express.static('src'));
app.listen(3000, () => {
    data = JSON.stringify(parser.getAllData());
    console.log("data is parsed");
});
