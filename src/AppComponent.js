import { createElement as e, Component } from 'react';
import GraphComponent from './GraphComponent';
import SearchBarComponent from './SearchBarComponent';
import nodeLists from './NodeListComponents.js';
import NodeDetailsComponent from './NodeDetailsComponent.js';
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
                               e(NodeDetailsComponent, {active: false, id: '', name: ''})),
                             e('div', {className: 'col-6'},
                               e(GraphComponent, {}, null)),
                             e('div', {className: 'col-3'},
                               e(nodeLists.SearchResultsListComponent, {active: false, nodes: [], title: 'Search Results'}, null),
                               e(NodeDetailsComponent, {active: false, id: '', name: ''})));
        return e('div', null, pageHeaderRow, containerHeaderRow, containerRow);
    }
}
export default AppComponent;
