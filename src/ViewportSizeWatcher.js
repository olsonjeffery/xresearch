import Constants from "./Constants.js";
import {actionViewportChange} from "./StateManagement.js";

export const getViewportHeight = () => {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};

let currState;
export const init = (store) => {
    window.addEventListener("resize", () => {
        var newHeight = getViewportHeight();
        store.dispatch(actionViewportChange(newHeight));
    });
};
