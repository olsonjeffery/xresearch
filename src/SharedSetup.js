import {combineReducers, createStore } from 'redux';

export var xrActions = {};
// sidebar modes
xrActions.DEFAULT_SEARCHTEXT = 'Enter topic to search';
xrActions.SIDEBAR_MODE_SPLASH = 'SIDEBAR_MODE_SPLASH';
xrActions.SIDEBAR_MODE_SEARCH_RESULTS = 'SIDEBAR_MODE_SEARCH_RESULTS';
xrActions.SIDEBAR_MODE_NODE_DETAILS = 'SIDEBAR_MODE_NODE_DETAILS';

xrActions.SET_XR_DATA = 'SET_XR_DATA';
xrActions.SEARCH_TEXT_CHANGE = 'SEARCH_TEXT_CHANGE';
xrActions.SIDEBAR_MODE_CHANGE = 'SIDEBAR_MODE_CHANGE';
xrActions.NODE_SELECTION = 'NODE_SELECTION';
xrActions.GRAPH_UPDATING_CHANGE = 'GRAPH_UPDATING_CHANGE';
xrActions.GRAPH_FILTERING_CATEGORY_CHANGE = 'GRAPH_FILTERING_CATEGORY_CHANGE';
xrActions.RESET_GRAPH_FILTERING_CATEGORIES = 'RESET_GRAPH_FILTERING_CATEGORIES';
// action dispatchers
xrActions.resetGraphFilteringCategories = () => {
    return {
        type: xrActions.GRAPH_FILTERING_CATEGORY_CHANGE
    };
};
xrActions.graphFilteringCategoryChange = (changedCategory, newValue) => {
    return {
        type: xrActions.GRAPH_FILTERING_CATEGORY_CHANGE,
        changedCategory,
        newValue
    };
};
xrActions.graphUpdatingChange = (graphUpdating) => {
    return {
        type: xrActions.GRAPH_UPDATING_CHANGE,
        graphUpdating
    };
};
xrActions.nodeSelection = (id) => {
    return {
        type: xrActions.NODE_SELECTION,
        selectedNodeId: id
    };
};
xrActions.setXrData = (xrData) => {
    return {
        type: xrActions.SET_XR_DATA,
        xrData
    };
};
xrActions.searchTextChange = (searchText) => {
    return {
        type: xrActions.SEARCH_TEXT_CHANGE,
        searchText
    };
};
xrActions.sidebarModeChange = (sidebarMode) => {
    return {
        type: xrActions.SIDEBAR_MODE_CHANGE,
        sidebarMode
    };
};

// reducers
var xrData = (state = {}, action) => {
    switch(action.type) {
    case xrActions.SET_XR_DATA:
        return action.xrData;
    default:
        return state;
    }
};
var searchText = (state = 'Enter topic to search', action) => {
    switch(action.type) {
    case xrActions.SEARCH_TEXT_CHANGE:
        return action.searchText;
    default:
        return state;
    }
};
var sidebarMode = (state = 'SIDEBAR_MODE_SPLASH', action) => {
    switch(action.type) {
    case xrActions.SIDEBAR_MODE_CHANGE:
        return action.sidebarMode;
    default:
        return state;
    }
};
var selectedNodeId = (state = null, action) => {
    switch(action.type) {
    case xrActions.NODE_SELECTION:
        return action.selectedNodeId;
    default:
        return state;
    }
};

var graphUpdating = (state = true, action) => {
    switch(action.type) {
    case xrActions.GRAPH_UPDATING_CHANGE:
        return action.graphUpdating;
    default:
        return state;
    }
};

var graphFilteringCategories = (state = {dependencies: true, dependedUponBy: true, unlocks: true, unlockedBy: true, getOneFree: true, giveOneFree: true}, action) => {
    switch(action.type) {
    case xrActions.GRAPH_FILTERING_CATEGORY_CHANGE:
        var newState = {};
        Object.assign(newState, state);
        newState[action.changedCategory] = action.newValue;
        return newState;
    case xrActions.RESET_GRAPH_FILTERING_CATEGORIES:
        return {
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
};

var rootReducer = combineReducers({xrData, searchText, sidebarMode, selectedNodeId, graphUpdating, graphFilteringCategories});
const initializeStoreImpl = () => {
    return createStore(rootReducer);
};

export var initializeStore = initializeStoreImpl;
