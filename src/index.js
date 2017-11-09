import { createElement as e } from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';

import { initializeStore, xrActions } from './SharedSetup.js';
import AppComponent from './AppComponent.js';

(() => {
    __store = initializeStore();
    ReactDOM.render(e(Provider, {store: __store},
                      e(AppComponent, {version: __xrData.version, xpiratezVersion: __xrData.xpiratezVersion}, null)), document.getElementById('app-root'));
})();
