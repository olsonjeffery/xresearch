import lunr from 'lunr';

import Constants from "./Constants.js";
import {actionViewportChange} from "./StateManagement.js";
import {allResearchData, researchById} from './XrDataQueries.js';

export const getViewportSize = () => {
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
};

export const initViewportChangeListener = (store) => {
    window.addEventListener("resize", () => {
        var newViewport = getViewportSize();
        store.dispatch(actionViewportChange(newViewport));
    });
};

let prevSelectedNodeId = null;
export const initScrollResetOnNodeSelection = (store) => {
    store.subscribe(() => {
        var state = store.getState();
        var newSelectedNodeId = state.selectedNodeId;
        if(newSelectedNodeId != prevSelectedNodeId) {
            prevSelectedNodeId = newSelectedNodeId;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    });
};


var lunrIndex = null;
export const topicsBySearchText = (searchText) => {
    if(lunrIndex == null) {
        lunrIndex = lunr(function() {
            this.field("name");

            _.each(allResearchData(), x => {
                var name = x.id;
                if(x.label != undefined) {
                    name = x.label.toLowerCase();
                    this.add({id: x.id, name: x.id});
                }
                this.add({id: x.id, name});
            });
        });
    }
    if (searchText == '') {
        return [];
    }
    var results = lunrIndex.search(`*${searchText.toLowerCase()}*`).map((x)=> {
        var targetNode = researchById(x.ref);
        return {id: x.ref, name: targetNode.label};
    });
    if(results.length > 40) {
        return [];
    }
    return results;
};
