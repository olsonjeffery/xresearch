const express = require('express');
const app = express();
const _ = require('lodash');
const fs = require('fs');

data = {};

// thank you, stackoverflow
function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}

app.get('/', (req, res) => {
    const parser = requireUncached('./ruleset-parser.js');
    data = JSON.stringify(parser.getAllData());
    console.log("data is parsed");
    var indexCompiled = _.template(fs.readFileSync('docs/index_template.html', 'utf8'));
    res.send(indexCompiled( { allData: data } ));
});
app.use(express.static('docs'));
app.use('src', express.static('src'));
app.listen(3000, () => {});
