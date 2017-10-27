const express = require('express');
const parser = require('./ruleset-parser');
const app = express();
const _ = require('lodash');
const fs = require('fs');

data = {};

app.get('/', (req, res) => {
    var indexCompiled = _.template(fs.readFileSync('dist/index_template.html', 'utf8'));
    res.send(indexCompiled( { allData: data } ));
});
app.use(express.static('public'));
app.use(express.static('dist'));
app.listen(3000, () => {
    data = JSON.stringify(parser.getAllData());
    console.log("data is parsed");
});
