import _ from 'lodash';
import { createElement as e } from 'react';
import ReactDOM from 'react-dom';

import xrActions from './SharedSetup.js';
import AppComponent from './AppComponent.js';

(() => {

    // FIXME: move this into the parser
    xrData.keysIndexMap = {};
    _.each(xrData.researchData, (x, idx) => {
        xrData.keysIndexMap[x.id] = idx;
    });
    __store = xrActions.createConfiguredStore(xrData);
    __store.dispatch(xrActions.setXrData(xrData));
    ReactDOM.render(e(AppComponent, {data: xrData, store: __store}, null), document.getElementById('app-root'));
})();
