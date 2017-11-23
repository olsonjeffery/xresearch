const express = require('express');
const app = express();
const _ = require('lodash');
const fs = require('fs');

// thank you, stackoverflow
function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}

app.get('/run-tests', (req, res) => {
    const parser = requireUncached('./rulesetParser.js');
    let data = JSON.stringify(parser.getAllData());
    console.log("REQ /run-tests ruleset parsed");
    let indexCompiled = _.template(fs.readFileSync('test_runner.html', 'utf8'));
    res.send(indexCompiled( { allData: data } ));
});
app.get('/', (req, res) => {
    const parser = requireUncached('./rulesetParser.js');
    let data = JSON.stringify(parser.getAllData());
    console.log("REQ / ruleset parsed");
    let indexCompiled = _.template(fs.readFileSync('docs/index_template.html', 'utf8'));
    res.send(indexCompiled( { allData: data } ));
});
app.use(express.static('docs'));
app.use('src', express.static('src'));
app.use('node_modules', express.static('node_modules'));
app.listen(3000, () => {});
