import _ from 'lodash';
import { createElement as e } from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';

import { initializeStore, xrActions } from './SharedSetup.js';
import AppComponent from './AppComponent.js';

(() => {

    // FIXME: move this into the parser
    xrData.keysIndexMap = {};
    _.each(xrData.researchData, (x, idx) => {
        xrData.keysIndexMap[x.id] = idx;
    });
    __store = initializeStore(xrData);
    __store.dispatch(xrActions.setXrData(xrData));
    ReactDOM.render(e(Provider, {store: __store},
                      e(AppComponent, {data: xrData}, null)), document.getElementById('app-root'));
})();
