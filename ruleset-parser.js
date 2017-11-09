const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');


module.exports.getAllData = () => {
    let mainRulesetFile = 'Piratez.rul';
    let langRulesetFile = 'Piratez_lang.rul';

    // pull down the ruleset and lang (with str mappings) file from YAML
    let package = require('./package.json');
    let ruleset = yaml.safeLoad(fs.readFileSync(mainRulesetFile, 'utf8'));
    let lang = yaml.safeLoad(fs.readFileSync(langRulesetFile, 'utf8'));

    // pull out the research doc
    let research = _.filter(ruleset.research, (i) => { return !i.delete && i.name !== 'STR_UNAVAILABLE'; });
    //lang.extraStrings[0].strings[research[0].name]

    // running tally of added entries
    let addedKeys = {};

    // reverse-relationships that need to be mapped
    let dependedUponBy = {};
    let unlockedBy = {};
    let giveOneFree = {};
    let requiredBy = {};

    // help to add entry in reverse-relationships collections
    let createOrUpdateItemInObject = (obj, key, item) => {
        if(!obj[key]) {
            obj[key] = [];
        }
        obj[key].push(item);
    };

    // STR_ key map of entries in items (key: type)
    let itemKeys = [];
    let itemsByKey = _.chain(ruleset.items).filter(x=>x.type !== undefined).reduce((memo, item) => {
        memo[item.type] = item;
        itemKeys.push(item.type);
        return item;
    }, {});

    // STR_ key map of entries in manufacture (key: name)
    let manufactureByKey = _.chain(ruleset.manufacture).filter(x=>x.name !== undefined).reduce((memo, item) => {
        memo[item.name] = item;
        return item;
    }, {}).value();

    // pass through YAML research one time to build up list,
    // mapping reverse-relationships as we go
    let researchData = _.reduce(research, (memo, item) => {
        addedKeys[item.name] = true;
        let label = lang.extraStrings[0].strings[item.name] == undefined ?
            item.name
            : lang.extraStrings[0].strings[item.name];
        let output = {
            id: item.name,
            label: label,
            points: item.points ? item.points : 0,
            cost: item.cost ? item.cost : 0
        };
        if(item.dependencies) {
            output.dependencies = item.dependencies;
            _.each(item.dependencies, x=>{createOrUpdateItemInObject(dependedUponBy, x, item.name);});
        }
        // set topic type
        if(typeof(item.needItem) != "undefined") {
            output.topicKind = "item";
            if(manufactureByKey[output.id]) {
                let manufacture = {
                    id: `${item.name}_M`,
                    label: `${label} [m]`,
                    dependencies: [ item.name ]
                };
                memo.push(manufacture);
                createOrUpdateItemInObject(dependedUponBy, manufacture.id, item.name);
            }
        } else {
            // this is a pure research topic
            output.topicKind = 'idea';
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
        if(itemsByKey[output.id]) {
            output.itemData = itemsByKey[output.id];
        }
        memo.push(output);
        return memo;
    }, []);
    // pass through created structure again through attach fully populated reverse-relationships
    _.each(researchData, (item) => {
        item.dependedUponBy = dependedUponBy[item.id] ? dependedUponBy[item.id] : [];
        item.unlockedBy = unlockedBy[item.id] ? unlockedBy[item.id] : [];
        item.giveOneFree = giveOneFree[item.id] ? giveOneFree[item.id] : [];
        item.requiredBy = requiredBy[item.id] ? requiredBy[item.id] : [];
    });

    // index mapping STR_ id keys to their index entries in researchData
    let keysIndexMap = {};
    _.each(researchData, (x, idx) => {
        keysIndexMap[x.id] = idx;
    });

    // map STR_ id keys to their plain-language names from lang file
    let langInverted = _.chain(addedKeys).keys().reduce((memo, k) => {
        let val = lang.extraStrings[0].strings[k];
        memo[val] = k;
        return memo;
    }, {}).value();

    return {
        xpiratezVersion: package.xpiratezVersion,
        version: package.version,
        researchData,
        langKeys: lang.extraStrings[0].strings,
        langInverted,
        keysIndexMap
    };
};
