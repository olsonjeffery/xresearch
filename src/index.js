import _ from 'lodash';
import { createElement as e } from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';

import { initializeStore, xrActions } from './SharedSetup.js';
import AppComponent from './AppComponent.js';

(() => {
    __store = initializeStore();
    __store.dispatch(xrActions.setXrData(__xrData));
    ReactDOM.render(e(Provider, {store: __store},
                      e(AppComponent, {xrData: __xrData}, null)), document.getElementById('app-root'));
})();
