const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');

module.exports.getAllData = () => {
    var mainRulesetFile = 'Piratez.rul';
    var langRulesetFile = 'Piratez_lang.rul';

    // pull down the ruleset and lang (with str mappings) file from YAML
    var ruleset = yaml.safeLoad(fs.readFileSync(mainRulesetFile, 'utf8'));
    var lang = yaml.safeLoad(fs.readFileSync(langRulesetFile, 'utf8'));

    // pull out the research doc
    var research = _.filter(ruleset.research, (i) => { return !i.delete && i.name !== 'STR_UNAVAILABLE'; });
    //lang.extraStrings[0].strings[research[0].name]

    var addedKeys = {};

    // "inverse" relationships that need to be mapped
    var dependedUponBy = {};
    var unlockedBy = {};
    var giveOneFree = {};
    var requiredBy = {};

    var createOrUpdateItemInObject = (obj, key, item) => {
        if(!obj[key]) {
            obj[key] = [];
        }
        obj[key].push(item);
    };

    var researchData = _.map(research, (item) => {
        addedKeys[item.name] = true;
        var output = {
            id: item.name,
            label: lang.extraStrings[0].strings[item.name],
            points: item.points ? item.points : 0,
            cost: item.cost ? item.cost : 0
        };
        if(item.dependencies) {
            output.dependencies = item.dependencies;
            _.each(item.dependencies, x=>{createOrUpdateItemInObject(dependedUponBy, x, item.name);});
        }
        if(typeof(item.needItem) != "undefined") {
            output.needItem = item.needItem;
        }
        if(item.getOneFree) {
            output.getOneFree = item.getOneFree;
            _.each(item.getOneFree, x=>{createOrUpdateItemInObject(giveOneFree, x, item.name);});
        }
        if(item.unlocks) {
            output.unlocks = item.unlocks;
            _.each(item.unlocks, x=>{createOrUpdateItemInObject(unlockedBy, x, item.name);});
        }
        if(item.requires) {
            output.requires = item.requires;
            _.each(item.requires, x=>{createOrUpdateItemInObject(requiredBy, x, item.name);});
        }
        return output;
    });
    _.each(researchData, (item) => {
        item.dependedUponBy = dependedUponBy[item.id] ? dependedUponBy[item.id] : [];
        item.unlockedBy = unlockedBy[item.id] ? unlockedBy[item.id] : [];
        item.giveOneFree = giveOneFree[item.id] ? giveOneFree[item.id] : [];
        item.requiredBy = requiredBy[item.id] ? requiredBy[item.id] : [];
    });

    var keysIndexMap = {};
    _.each(researchData, (x, idx) => {
        keysIndexMap[x.id] = idx;
    });

    var langInverted = _.chain(addedKeys).keys().reduce((memo, k) => {
        var val = lang.extraStrings[0].strings[k];
        memo[val] = k;
        return memo;
    }, {}).value();

    return {
        researchData,
        langKeys: lang.extraStrings[0].strings,
        langInverted,
        keysIndexMap
    };
};
