import {combineReducers, createStore } from 'redux';

var xrActionsLocal = {};
// sidebar modes
xrActionsLocal.DEFAULT_SEARCHTEXT = 'Enter topic to search';
xrActionsLocal.SIDEBAR_MODE_SEARCH_RESULTS = 'SIDEBAR_MODE_SEARCH_RESULTS';
xrActionsLocal.SIDEBAR_MODE_NODE_DETAILS = 'SIDEBAR_MODE_NODE_DETAILS';

xrActionsLocal.SET_XR_DATA = 'SET_XR_DATA';
xrActionsLocal.SEARCH_TEXT_CHANGE = 'SEARCH_TEXT_CHANGE';
xrActionsLocal.SIDEBAR_MODE_CHANGE = 'SIDEBAR_MODE_CHANGE';
xrActionsLocal.NODE_SELECTION = 'NODE_SELECTION';
// action dispatchers
xrActionsLocal.nodeSelection = (id) => {
    return {
        type: xrActionsLocal.NODE_SELECTION,
        selectedNodeId: id
    };
};
xrActionsLocal.setXrData = (xrData) => {
    return {
        type: xrActionsLocal.SET_XR_DATA,
        xrData
    };
};
xrActionsLocal.searchTextChange = (searchText) => {
    return {
        type: xrActionsLocal.SEARCH_TEXT_CHANGE,
        searchText
    };
};
xrActionsLocal.sidebarModeChange = (sidebarMode) => {
    return {
        type: xrActionsLocal.SIDEBAR_MODE_CHANGE,
        sidebarMode
    };
};

// reducers
var xrData = (state = {}, action) => {
    switch(action.type) {
    case xrActionsLocal.SET_XR_DATA:
        return action.xrData;
    default:
        return state;
    }
};
var searchText = (state = 'Enter topic to search', action) => {
    switch(action.type) {
    case xrActionsLocal.SEARCH_TEXT_CHANGE:
        return action.searchText;
    default:
        return state;
    }
};
var sidebarMode = (state = 'SIDEBAR_SPLASH', action) => {
    switch(action.type) {
    case xrActionsLocal.SIDEBAR_MODE_CHANGE:
        return action.sidebarMode;
    default:
        return state;
    }
};
var selectedNodeId = (state = null, action) => {
    switch(action.type) {
    case xrActionsLocal.NODE_SELECTION:
        return action.selectedNodeId;
    default:
        return state;
    }
};

var rootReducer = combineReducers({xrData, searchText, sidebarMode, selectedNodeId});
const initializeStoreImpl = () => {
    return createStore(rootReducer);
};

export var initializeStore = initializeStoreImpl;
export var xrActions = xrActionsLocal;
