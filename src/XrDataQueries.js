const getXrData = () => {
    return __xrData;
};

export function researchById(targetId) {
    var xrData = getXrData();
    return xrData.researchData[xrData.keysIndexMap[targetId]];
};

export function getLabelFromXrData(id) {
    var xrData = getXrData();
    var keyIdx = xrData.keysIndexMap[id];
    var topic = researchById(id);
    if(keyIdx == undefined) {
        // FIXME: the key is probably coming from vanilla
        return id;
    }
    else if(topic.label == undefined) {
        return id;
    } else {
        return topic.label;
    }
};

export function allResearchData() {
    return getXrData().researchData;
}
