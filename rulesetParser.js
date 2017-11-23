const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');

const getResearchFromRuleset = (ruleset) => {
    return _.filter(ruleset.research, (i) => { return !i.delete && i.name !== 'STR_UNAVAILABLE'; });
};

const initializeOutput = (id, lang) => {
    let label = lang.extraStrings[0].strings[id] == undefined ?
        id
        : lang.extraStrings[0].strings[id];
    return { id, label };
};

const inverseRelationship = {
    requiredItems: 'requiredToManufacture',
    requires : 'requiredBy',
    requiresBuy : 'requiredBy',
    getOneFree : 'giveOneFree',
    dependencies : 'dependedUponBy',
    unlocks: 'unlockedBy'
};

// help to add entry in reverse-relationships collections
const createOrUpdateItemInObject = (obj, key, item) => {
    if(!obj[key]) {
        obj[key] = [];
    }
    obj[key].push(item);
};

const mapRequiredItemsRelationship = (currentItem, output, reverseRels, currentId) => {
    let edgeName = 'requiredItems';
    if(currentItem[edgeName]) {
        if(!output[edgeName]) {
            output[edgeName] = [];
        }
        _.each(Reflect.ownKeys(currentItem[edgeName]), x => {
            if(x != null) {
                output[edgeName].push({id: x, quantity: currentItem[edgeName][x]});
                createOrUpdateItemInObject(reverseRels[inverseRelationship[edgeName]], x, currentId);
            }
        });
    }
};

const mapRelationship = (edgeName, currentItem, output, reverseRels, currentId) => {
    if(currentItem[edgeName]) {
        if(!output[edgeName]) {
            output[edgeName] = [];
        }
        _.each(currentItem[edgeName], x => {
            if(x != null && x != currentId) {
                output[edgeName].push(x);

                if(currentId == null) {
                    console.log(`null item being put into reverse rel... why? key ${x}`);
                }
                createOrUpdateItemInObject(reverseRels[inverseRelationship[edgeName]], x, currentId);
            }
        });
    }
};

const remapAllReverseRelationships = (graphNodes, reverseRels) => {
    _.each(Reflect.ownKeys(graphNodes), (key) => {
        let item = graphNodes[key];
        item.dependedUponBy = reverseRels.dependedUponBy[item.id] ? reverseRels.dependedUponBy[item.id] : [];
        item.unlockedBy = reverseRels.unlockedBy[item.id] ? reverseRels.unlockedBy[item.id] : [];
        item.giveOneFree = reverseRels.giveOneFree[item.id] ? reverseRels.giveOneFree[item.id] : [];
        item.requiredBy = reverseRels.requiredBy[item.id] ? reverseRels.requiredBy[item.id] : [];
        item.requiredToManufacture = reverseRels.requiredToManufacture[item.id] ? reverseRels.requiredToManufacture[item.id] : [];
    });
};

const initializeGraphNodesFromResearchContent = (ruleset, lang) => {
    // reverse-relationships that need to be mapped
    let reverseRels = {
        requiredToManufacture:{},
        dependedUponBy: {},
        unlockedBy: {},
        giveOneFree: {},
        requiredBy: {}
    };

    // pull out the research doc
    let research = getResearchFromRuleset(ruleset);

    let graphNodes = _.reduce(research, (memo, item) => {
        let output = initializeOutput(item.name, lang);
        output = {
            ...output,
            points: item.points ? item.points : 0,
            costResearch: item.cost ? item.cost : 0
        };
        // set topic type
        if(typeof(item.needItem) != "undefined") {
            output.topicKind = "item";
        } else {
            // this is a pure research topic
            output.topicKind = 'idea';
        }
        mapRelationship('dependencies', item, output, reverseRels, item.name);
        mapRelationship('getOneFree', item, output, reverseRels, item.name);
        mapRelationship('unlocks', item, output, reverseRels, item.name);
        mapRelationship('requires', item, output, reverseRels, item.name);
        memo[output.id] = output;
        return memo;
    }, {});

    return {graphNodes, reverseRels};
};

const addItemsToGraphNodes = (ruleset, inputGraphNodes, reverseRels, lang) => {
    // STR_ key map of entries in items (key: type)
    let graphNodes = _.chain(ruleset.items).filter(x=>x.type !== undefined).reduce((memo, item) => {
        let output = memo[item.type];
        if(output == undefined) {
            // item is not in graphNodes set
            output = {
                ...initializeOutput(item.type, lang),
                topicKind: 'item'
            };
            memo[output.id] = output;
        }

        output.costBuy = item.costBuy;
        output.costSell = item.costSell;

        mapRelationship('requires', item, output, reverseRels, item.type);
        mapRelationship('requiresBuy', item, output, reverseRels, item.type);

        return memo;
    }, inputGraphNodes).value();
    return { graphNodes, reverseRels };
};

const addManufactureToGraphNodes = (ruleset, inputGraphNodes, reverseRels, lang) => {
    // STR_ key map of entries in manufacture (key: name)
    let graphNodes = _.chain(ruleset.manufacture).filter(x=>x.name !== undefined).reduce((memo, item) => {
        let output = memo[item.name];
        if(!memo[item.name]) {
            output = {
                ...initializeOutput(item.name, lang),
                topicKind: 'item'
            };
            memo[output.id] = output;
        }

        if(item.cost) {
            output.costManufacture = item.cost;
        }
        output.timeTotalManufacture = item.time;
        mapRelationship('requires', item, output, reverseRels, item.name);
        mapRequiredItemsRelationship(item, output, reverseRels, item.name);
        return memo;
    }, inputGraphNodes).value();
    return {graphNodes, reverseRels};
};

const addFacilitiesToGraphNodes = (ruleset, inputGraphNodes, reverseRels, lang) => {
    let graphNodes = _.chain(ruleset.facilities).filter(x=>x.type !== undefined).reduce((memo, item) => {
        let output = memo[item.type];
        if(output == undefined) {
            output = {
                ...initializeOutput(item.type, lang)
            };
            memo[output.id] = output;
        }
        output.topicKind = 'facility';
        output.timeBuild = item.buildTime * 24; // standardize time as hours
        output.costBuild = item.buildCost;
        output.costMonthly = item.monthlyCost;
        output.costRefund = item.refundValue;
        if(item.labs) {
            output.labs = item.labs;
        }

        mapRelationship('requires', item, output, reverseRels, item.type);

        return memo;
    }, inputGraphNodes).value();
    return { graphNodes, reverseRels };
};

const yamlLoad = (filePath) => {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'), {json: true});
};

module.exports.getAllData = () => {
    let mainRulesetFile = 'Piratez.rul';
    let langRulesetFile = 'Piratez_lang.rul';

    // pull down the ruleset and lang (with str mappings) file from YAML
    let package = require('./package.json');
    let xpRuleset = yamlLoad(mainRulesetFile);
    let xpLang = yamlLoad(langRulesetFile);

    // STR_ key map of entries in items (key: type)
    let itemsByKey = _.chain(xpRuleset.items).filter(x=>x.type !== undefined).reduce((memo, item) => {
        memo[item.type] = item;
        return memo;
    }, {}).value();

    // pass through YAML research one time to build up list,
    // mapping reverse-relationships as we go
    let researchGN = initializeGraphNodesFromResearchContent(xpRuleset, xpLang);
    let itemGN = addItemsToGraphNodes(xpRuleset, researchGN.graphNodes, researchGN.reverseRels, xpLang);
    let manGN = addManufactureToGraphNodes(xpRuleset, itemGN.graphNodes, itemGN.reverseRels, xpLang);
    let facilitiesGN = addFacilitiesToGraphNodes(xpRuleset, manGN.graphNodes, manGN.reverseRels, xpLang);
    remapAllReverseRelationships(facilitiesGN.graphNodes, facilitiesGN.reverseRels);
    let {graphNodes} = facilitiesGN;

    return {
        xpiratezVersion: package.xpiratezVersion,
        version: package.version,
        graphNodes
    };
};
