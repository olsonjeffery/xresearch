const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');
const orgParser = require('org-mode-parser');

const getResearchFromXpRuleset = (ruleset) => {
    return _.filter(ruleset.research, (i) => { return i.name !== 'STR_UNAVAILABLE'; });
};

const initializeOutput = (id, lang) => {
    let label = lang[id] == undefined ?
        id
        : lang[id];
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

const initializeGraphNodesFromResearchContent = (research, lang) => {
    // reverse-relationships that need to be mapped
    let reverseRels = {
        requiredToManufacture:{},
        dependedUponBy: {},
        unlockedBy: {},
        giveOneFree: {},
        requiredBy: {}
    };

    let graphNodes = _.reduce(Reflect.ownKeys(research), (memo, itemKey) => {
        var item = research[itemKey];
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
        if(item.requiresBaseFunc) {
            output.requiresBaseFunc = item.requiresBaseFunc;
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

const addItemsToGraphNodes = (items, inputGraphNodes, reverseRels, lang) => {
    // STR_ key map of entries in items (key: type)
    let graphNodes = _.reduce(Reflect.ownKeys(items), (memo, itemKey) => {
        var item = items[itemKey];
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
    }, inputGraphNodes);
    return { graphNodes, reverseRels };
};

const addManufactureToGraphNodes = (manufacture, inputGraphNodes, reverseRels, lang) => {
    // STR_ key map of entries in manufacture (key: name)
    let graphNodes = _.reduce(Reflect.ownKeys(manufacture), (memo, itemKey) => {
        var item = manufacture[itemKey];
        let output = memo[item.name];
        if(!memo[item.name]) {
            output = {
                ...initializeOutput(item.name, lang),
                topicKind: 'item'
            };
            memo[output.id] = output;
        }

        if(item.requiresBaseFunc) {
            output.requiresBaseFunc = item.requiresBaseFunc;
        }
        if(item.cost) {
            output.costManufacture = item.cost;
        }
        output.timeTotalManufacture = item.time;
        mapRelationship('requires', item, output, reverseRels, item.name);
        mapRequiredItemsRelationship(item, output, reverseRels, item.name);
        return memo;
    }, inputGraphNodes);
    return {graphNodes, reverseRels};
};

const addFacilitiesToGraphNodes = (facilities, inputGraphNodes, reverseRels, lang) => {
    let graphNodes = _.reduce(Reflect.ownKeys(facilities), (memo, itemKey) => {
        var item = facilities[itemKey];
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
        if(item.provideBaseFunc) {
            output.provideBaseFunc = item.provideBaseFunc;
        }
        if(item.requiresBaseFunc) {
            output.requiresBaseFunc = item.requiresBaseFunc;
        }

        mapRelationship('requires', item, output, reverseRels, item.type);

        return memo;
    }, inputGraphNodes);
    return { graphNodes, reverseRels };
};

const yamlLoad = (filePath) => {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'), {json: true});
};

const addOrphanLangEntriesTo = (graphNodes, output, lang, entries) => {
    _.each(entries, (entry) => {
        if(!graphNodes[entry]) output[entry] = lang[entry];
    });
};

const buildOrphanLang = (graphNodes, lang) => {
    var output = {};
    _.each(Reflect.ownKeys(graphNodes), (itemKey) => {
        var item = graphNodes[itemKey];
        if(item.dependencies) {
            addOrphanLangEntriesTo(graphNodes, output, lang, item.dependencies);
        }
        if(item.requires) {
            addOrphanLangEntriesTo(graphNodes, output, lang, item.requires);
        }
        if(item.unlocks) {
            addOrphanLangEntriesTo(graphNodes, output, lang, item.unlocks);
        }
        if(item.getOneFree) {
            addOrphanLangEntriesTo(graphNodes, output, lang, item.getOneFree);
        }
        if(item.requiredToManufacture) {
            addOrphanLangEntriesTo(graphNodes, output, lang, Reflect.ownKeys(item.requiredToManufacture));
        }
    });
    return output;
};

const getProvidedFunctionalitiesFrom = (facilities) => {
    let baseFunctionalities = {};
    Reflect.ownKeys(facilities).forEach(fKey => {
        var facility = facilities[fKey];
        if(facility.provideBaseFunc) {
            facility.provideBaseFunc.forEach(baseFunc => {
                if(!baseFunctionalities[baseFunc]) {
                    baseFunctionalities[baseFunc] = [];
                }
                baseFunctionalities[baseFunc].push(fKey);
            });
        }
    });
    return baseFunctionalities;
};

const parseAppDataFrom = ({allResearch, allManufacture, allItems, allFacilities, allLangsets, package}) => {
    let lang = mergeAndKeyLangsets(allLangsets);
    let research = mergeAndKeyRulesets(allResearch, 'name');
    let items = mergeAndKeyRulesets(allItems, 'type');
    let manufacture = mergeAndKeyRulesets(allManufacture, 'name');
    let facilities = mergeAndKeyRulesets(allFacilities, 'type');

    let researchGN = initializeGraphNodesFromResearchContent(research, lang);
    let itemGN = addItemsToGraphNodes(items, researchGN.graphNodes, researchGN.reverseRels, lang);
    let manGN = addManufactureToGraphNodes(manufacture, itemGN.graphNodes, itemGN.reverseRels, lang);
    let facilitiesGN = addFacilitiesToGraphNodes(facilities, manGN.graphNodes, manGN.reverseRels, lang);
    let baseFunctionalities = getProvidedFunctionalitiesFrom(facilities);

    remapAllReverseRelationships(facilitiesGN.graphNodes, facilitiesGN.reverseRels);

    let {graphNodes} = facilitiesGN;

    return {
        xpiratezVersion: package.xpiratezVersion,
        version: package.version,
        orphanLang: buildOrphanLang(graphNodes, lang),
        graphNodes: graphNodes,
        baseFunctionalities
    };
};

const mergeAndKeyRulesets = (rulesetArrays, keyName) => {
    var output = {};
    _.each(rulesetArrays, (rules) => {
        var deletes = [];
        var keysInRules = {};
        _.each(rules, (item)=> {
            if(item.delete) {
                deletes.push(item.delete);
            } else if(item.type === 'STR_UNAVAILABLE' || item.name === 'STR_UNAVAILABLE') {
                // do nothing
            } else {
                keysInRules[item[keyName]] = true;
                output[item[keyName]] = item;
            }
        });
        deletes = _.filter(deletes, (key) => !keysInRules[key]);
        _.each(deletes, (dKey) => {
            delete output[dKey];
        });
    });
    return output;
};

const mergeAndKeyLangsets = (langsetArrays) => {
    var output = {};
    _.each(langsetArrays, (langset) => {
        _.each(Reflect.ownKeys(langset), (itemKey) => {
            var name = 'STR_CORPSE_SYNTH_SPACE_SUIT';
            if(itemKey == name) {
                console.log('`Found ${name}: ${langset[name]}`');
            }
            output[itemKey] = langset[itemKey];
        });
    });
    return output;
};

const getRulesetPayload = () => {
    let xcom1ResearchFilePath = 'rulesets/xcom1.research.rul';
    let xcom1ItemsFilePath = 'rulesets/xcom1.items.rul';
    let xcom1ManufactureFilePath = 'rulesets/xcom1.manufacture.rul';
    let xcom1LangFilePath = 'rulesets/xcom1.en-US.yml';
    let xcom1FacilitiesFilePath = 'rulesets/xcom1.facilities.rul';
    let xcom1CraftsFilePath = 'rulesets/xcom1.crafts.rul';
    let xpRulesetFilePath = 'rulesets/Piratez.rul';
    let xpLangFilePath = 'rulesets/Piratez_lang.rul';

    // pull down the ruleset and lang (with str mappings) file from YAML
    let package = require('./package.json');
    let xpRuleset = yamlLoad(xpRulesetFilePath);

    // pass through YAML research one time to build up list,
    // mapping reverse-relationships as we go
    let allLangsets = [
        yamlLoad(xcom1LangFilePath)['en-US'],
        yamlLoad(xpLangFilePath).extraStrings[0].strings
    ];
    let allResearch = [
        yamlLoad(xcom1ResearchFilePath).research,
        xpRuleset.research,
    ];
    let allItems = [
        yamlLoad(xcom1ItemsFilePath).items,
        xpRuleset.items
    ];
    let allManufacture = [
        yamlLoad(xcom1ManufactureFilePath).manufacture,
        xpRuleset.manufacture
    ];
    let allFacilities = [
        yamlLoad(xcom1FacilitiesFilePath).facilities,
        xpRuleset.facilities
    ];
    let allCrafts = [
        yamlLoad(xcom1CraftsFilePath).crafts,
        xpRuleset.crafts
    ];

    return {
        allLangsets,
        allResearch,
        allManufacture,
        allItems,
        allFacilities,
        allCrafts,
        package
    };
};

module.exports.getRulesetPayload = getRulesetPayload;
module.exports.parseAppDataFrom = parseAppDataFrom;
module.exports.getAllData = () => {
    var dataPayload = getRulesetPayload();
    return parseAppDataFrom(dataPayload);
};
