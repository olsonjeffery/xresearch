import {combineReducers, createStore } from 'redux';

var xrActions = {};
// sidebar modes
xrActions.SIDEBAR_MODE_SEARCH_RESULTS = 'SIDEBAR_MODE_SEARCH_RESULTS';
xrActions.SIDEBAR_MODE_NODE_DETAILS = 'SIDEBAR_MODE_NODE_DETAILS';

xrActions.SET_XR_DATA = 'SET_XR_DATA';
xrActions.SEARCH_TEXT_CHANGE = 'SEARCH_TEXT_CHANGE';
xrActions.SIDEBAR_MODE_CHANGE = 'SIDEBAR_MODE_CHANGE';
xrActions.NODE_SELECTION = 'NODE_SELECTION';
// action dispatchers
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
var searchText = (state = '', action) => {
    switch(action.type) {
    case xrActions.SEARCH_TEXT_CHANGE:
        return action.searchText;
    default:
        return state;
    }
};
var sidebarMode = (state = 'SIDEBAR_SPLASH', action) => {
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
var rootReducer = combineReducers({xrData, searchText, sidebarMode, selectedNodeId});
xrActions.createConfiguredStore = () => {
    return createStore(rootReducer);
};

export default xrActions;
