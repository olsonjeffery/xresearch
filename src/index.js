import { createElement as e } from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';

import { actionViewportChange, initializeStore } from './StateManagement.js';
import AppComponent from './AppComponent.js';
import {initViewportChangeListener, initScrollResetOnNodeSelection, getViewportSize } from "./PassiveServices.js";

(() => {
    // init redux store
    __store = initializeStore();

    // set up redux integration w/ event listener to update the redux store whenever
    // the viewport changes
    __store.dispatch(actionViewportChange(getViewportSize()));
    initViewportChangeListener(__store);

    // reset scroll to top-of-page whenever a selectedNodeId changes
    initScrollResetOnNodeSelection(__store);

    ReactDOM.render(e(Provider, {store: __store},
                      e(AppComponent, {version: __xrData.version, xpiratezVersion: __xrData.xpiratezVersion}, null)), document.getElementById('app-root'));
})();
