import {expect} from 'chai';
import {researchById, allResearchData, isTopicInGraphNodes} from './XrDataQueries.js';
import {topicsBySearchText} from './PassiveServices.js';

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
