import {combineReducers, createStore } from 'redux';
import {Constants} from './Constants.js';

// action dispatchers
export function actionViewportChange(newViewportSize) {
    return {
        type: Constants.VIEWPORT_CHANGE,
        newViewportSize
    };
}
export function graphFilteringCategoryChange(changedCategory, newValue) {
    return {
        type: Constants.GRAPH_FILTERING_CATEGORY_CHANGE,
        changedCategory,
        newValue
    };
};
export function graphUpdatingChange(graphUpdating) {
    return {
        type: Constants.GRAPH_UPDATING_CHANGE,
        graphUpdating
    };
};
export function nodeSelection(id) {
    return {
        type: Constants.NODE_SELECTION,
        selectedNodeId: id
    };
};
export function searchTextChange(searchText) {
    return {
        type: Constants.SEARCH_TEXT_CHANGE,
        searchText
    };
};

// reducers
const searchText = (state = 'Search by topic...', action) => {
    switch(action.type) {
    case Constants.SEARCH_TEXT_CHANGE:
        return action.searchText;
    case Constants.NODE_SELECTION:
        return '';
    default:
        return state;
    }
};
const selectedNodeId = (state = null, action) => {
    switch(action.type) {
    case Constants.NODE_SELECTION:
        return action.selectedNodeId;
    default:
        return state;
    }
};

const graphUpdating = (state = false, action) => {
    switch(action.type) {
    case Constants.GRAPH_UPDATING_CHANGE:
        return action.graphUpdating;
    default:
        return state;
    }
};

const graphFilteringCategories = (state = {dependencies: true, dependedUponBy: true, unlocks: true, unlockedBy: true, getOneFree: true, giveOneFree: true, requires: true, requiredBy: true, requiredToManufacture: true, requiresBuy: true}, action) => {
    switch(action.type) {
    case Constants.GRAPH_FILTERING_CATEGORY_CHANGE:
        var newState = {};
        Object.assign(newState, state);
        newState[action.changedCategory] = action.newValue;
        return newState;
    case Constants.NODE_SELECTION:
        switch(action.selectedNodeId) {
        case null:
            return {
                requires: true,
                requiredBy: true,
                requiredToManufacture: true,
                requiresBuy: true,
                dependencies: true,
                dependedUponBy: true,
                unlocks: true,
                unlockedBy: true,
                giveOneFree: true,
                getOneFree: true
            };
        default:
            return state;
        }
    default:
        return state;
    }
};

const viewportSize = (state = {width: 1, height: 1}, action) => {
    switch(action.type) {
    case Constants.VIEWPORT_CHANGE:
        return action.newViewportSize;
    default:
        return state;
    }
};

const rootReducer = combineReducers({searchText, selectedNodeId, graphUpdating, graphFilteringCategories, viewportSize});
export function initializeStore() {
    return createStore(rootReducer);
};
