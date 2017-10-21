const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');

module.exports.getResearch = () => {
    var mainRulesetFile = 'Piratez.rul';
    var langRulesetFile = 'Piratez_lang.rul';

    // pull down the ruleset and lang (with str mappings) file from YAML
    var ruleset = yaml.safeLoad(fs.readFileSync(mainRulesetFile, 'utf8'));
    var lang = yaml.safeLoad(fs.readFileSync(langRulesetFile, 'utf8'));

    // pull out the research doc
    var research = _.filter(ruleset.research, (i) => { return !i.delete && i.name !== 'STR_UNAVAILABLE'; });
    //lang.extraStrings[0].strings[research[0].name]

    return _.map(research, (item) => {
        var output = {
            id: item.name,
            label: lang.extraStrings[0].strings[item.name],
            points: item.points,
            cost: item.cost
        };
        if(item.dependencies) {
            output.dependencies = item.dependencies;
        }
        if(typeof(item.needItem) != "undefined") {
            output.needItem = item.needItem;
        }
        if(item.getOneFree) {
            output.getOneFree = item.getOneFree;
        }
        if(item.unlocks) {
            output.unlocks = item.unlocks;
        }
        if(item.requires) {
            output.requires = item.requires;
        }
        return output;
    });
};
