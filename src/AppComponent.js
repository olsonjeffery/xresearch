import { createElement as e, Component } from 'react';
import GraphComponent from './GraphComponent';
import SearchBarComponent from './SearchBarComponent';
import {SearchResultsListComponent} from './NodeListComponents.js';
import {LeftDetailsComponent, RightDetailsComponent} from './NodeDetailsComponent.js';
import NodeSummaryComponent from './NodeSummaryComponent.js';

class AppComponent extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
    }
    componentDidMount() {
    }
    render() {
        var pageHeaderRow = e('div', {className: 'row'},
                              e('div', {className: 'col-9'},
                                e('h3', null, e('i', {className: 'fa fa-eye'}, null), ' XPiratez Research Tree Explorer (xresearch)')),
                              e('div', {className: 'col-3', style: {paddingTop: '15px'} },
                                e(SearchBarComponent, {searchText: 'Enter topic name...'}, null)));
        var containerHeaderRow = e(NodeSummaryComponent, {}, null);
        var containerRow = e('div', {className: 'row'},
                             e('div', {className: 'col-3'},
                               e(LeftDetailsComponent, {}, null)),
                             e('div', {className: 'col-6'},
                               e(GraphComponent, {}, null)),
                             e('div', {className: 'col-3'},
                               e(SearchResultsListComponent, {active: false, nodes: [], title: 'Search Results'}, null),
                               e(RightDetailsComponent, {}, null)));
        return e('div', null, pageHeaderRow, containerHeaderRow, containerRow);
    }
}
export default AppComponent;
