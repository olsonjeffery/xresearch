import {combineReducers, createStore } from 'redux';
import Constants from './Constants.js';

// action dispatchers
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
const searchText = (state = 'Enter topic to search', action) => {
    switch(action.type) {
    case Constants.SEARCH_TEXT_CHANGE:
        return action.searchText;
    default:
        return state;
    }
};
const sidebarMode = (state = 'SIDEBAR_MODE_SPLASH', action) => {
    switch(action.type) {
    case Constants.SEARCH_TEXT_CHANGE:
        return Constants.SIDEBAR_MODE_SEARCH_RESULTS;
    case Constants.NODE_SELECTION:
        if(action.selectedNodeId == null) {
            return Constants.SIDEBAR_MODE_SPLASH;
        } else {
            return Constants.SIDEBAR_MODE_NODE_DETAILS;
        }
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

const graphUpdating = (state = true, action) => {
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

const rootReducer = combineReducers({searchText, sidebarMode, selectedNodeId, graphUpdating, graphFilteringCategories});
export function initializeStore() {
    return createStore(rootReducer);
};
