import _ from 'lodash';

const getXrData = () => {
    return __xrData;
};

export function researchById(targetId) {
    var xrData = getXrData();
    return xrData.graphNodes[targetId];
};

export function allResearchData() {
    var xrData = getXrData();
    return _.map(Reflect.ownKeys(xrData.graphNodes), key => xrData.graphNodes[key]);
};

export function isTopicInGraphNodes(id) {
    return getXrData().graphNodes[id];
}
