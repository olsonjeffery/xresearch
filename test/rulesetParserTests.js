const expect = require('chai').expect;

let parser = require('../ruleset-parser.js');

const STR_NO_AGGRESSION = 'STR_NO_AGGRESSION';
const STR_MORTAR = 'STR_MORTAR';
const STR_AIRBALLS = 'STR_AIRBALLS';
const STR_GYM_ROOM = 'STR_GYM_ROOM';
const STR_SCRAP_METAL = 'STR_SCRAP_METAL';
const STR_BOW_NEON = 'STR_BOW_NEON';
const STR_ELERIUM_115 = 'STR_ELERIUM_115';
const STR_RAIDER_SCOUT = 'STR_RAIDER_SCOUT';
const STR_ALIEN_ORIGINS = 'STR_ALIEN_ORIGINS';

describe('ruleset-parser', () => {
    describe('when running the total parser', () => {
        let output = parser.getAllData();

        describe('happy path', () => {
            it('should have pure research topic data', () => {
                let topic = output.graphNodes[STR_NO_AGGRESSION];
                expect(topic.costResearch).to.be.a('number');
                expect(topic.points).to.be.a('number');
            });

            it('should have item topic data', () => {
                let topic = output.graphNodes[STR_MORTAR];
                expect(topic.costBuy).to.be.a('number');
            });

            it('should have manufacturable topic data', () => {
                let topic = output.graphNodes[STR_AIRBALLS];
                expect(topic.costManufacture).to.be.a('number');
            });

            it('should have facility data', () => {
                let topic = output.graphNodes[STR_GYM_ROOM];
                expect(topic.costBuild).to.be.a('number');
            });
        });

        describe('relationships', () => {
            it('dependencies', () => {
                let topic = output.graphNodes[STR_NO_AGGRESSION];
                expect(topic.dependencies.length).to.not.equal(0);
            });
            it('dependedUponBy', () => {
                let topic = output.graphNodes[STR_NO_AGGRESSION];
                expect(topic.dependedUponBy.length).to.not.equal(0);
            });
            it('requires', () => {
                let topic = output.graphNodes[STR_BOW_NEON];
                expect(topic.requires.length).to.not.equal(0);
            });
            it('requiredBy', () => {
                let topic = output.graphNodes[STR_ELERIUM_115];
                expect(topic.requiredBy.length).to.not.equal(0);
            });
            it('getOneFree', () => {
                // FIXME
                let topic = output.graphNodes[STR_ELERIUM_115];
                expect(topic.giveOneFree.length).to.not.equal(0);
            });
            it('giveOneFree', () => {
                // FIXME
                let topic = output.graphNodes[STR_RAIDER_SCOUT];
                expect(topic.getOneFree.length).to.not.equal(0);
            });
            it('unlocks', () => {
                let topic = output.graphNodes[STR_RAIDER_SCOUT];
                expect(topic.unlocks.length).to.not.equal(0);
            });
            it('unlockedBy', () => {
                let topic = output.graphNodes[STR_ALIEN_ORIGINS];
                expect(topic.unlockedBy.length).to.not.equal(0);
            });
            it('requiredItems', () => {
                let topic = output.graphNodes[STR_BOW_NEON];
                expect(topic.requiredItems.length).to.not.equal(0);
            });
            it('requiredToManufacture', () => {
                let topic = output.graphNodes[STR_ELERIUM_115];
                expect(topic.requiredToManufacture.length).to.not.equal(0);
            });
            it('requiresBuy', () => {
                let topic = output.graphNodes[STR_MORTAR];
                expect(topic.requiresBuy.length).to.not.equal(0);
            });
        });
    });
});
