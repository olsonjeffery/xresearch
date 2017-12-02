import {expect} from 'chai';
import {getFacilitiesForBaseFunc, researchById, allResearchData, isTopicInGraphNodes} from './XrDataQueries.js';
import {topicsBySearchText} from './PassiveServices.js';
import {parseBuildTime} from './Utility.js';

const STR_ELERIUM_115 = 'STR_ELERIUM_115';

describe('xresearch data queries', () => {
    it('researchById should work', () => {
        var topic = researchById(STR_ELERIUM_115);
        expect(topic.requiredToManufacture.length).to.not.be.equal(0);
    });
    it('allResearchData should work', () => {
        var allTopics = allResearchData();
        expect(allTopics).to.be.an('array');
        expect(allTopics.length).to.not.be.equal(0);
    });
    describe('isTopicInGraphNodes', () => {
        it('should return false for non-valid topics by key', () => {
            expect(isTopicInGraphNodes('sdfsdfsdf')).to.be.equal(false);
        });
        it('should return true for valid topics by key', () => {
            expect(isTopicInGraphNodes(STR_ELERIUM_115)).to.be.equal(true);
        });
    });
    describe('getFacilitiesForBaseFunc', () => {
        it('should provide associated facilities from xrData', () => {
            let result = getFacilitiesForBaseFunc('CPU');
            expect(result).to.be.an('array');
            expect(result).to.include('STR_COMPUTER_CORE');
        });
    });
});

describe('lunr search', () => {
    topicsBySearchText('');
    it('should return no results when search is too vague', () => {
        var results = topicsBySearchText('fu');
        expect(results.length).to.be.equal(0);
    });
    it('should return a result when enough input is provided', () => {
        var results = topicsBySearchText('futu');
        expect(results.length).to.be.equal(1);
    });
});

describe("parseBuildTime", () => {
    it('when only one parameter is provided, should turn 36 hours into 1d12hr', () => {
        expect(parseBuildTime(36)).to.be.equal('1d12hr');
    });
    it('when a second parameter is provided and is equal to 2, should turn 36 hours into 18hr', () => {
        expect(parseBuildTime(36, 2)).to.be.equal('18hr');
    });
});
