import Constants from "./Constants.js";
import {actionViewportChange} from "./StateManagement.js";

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
