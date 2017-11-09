import { createElement as e, Component } from 'react';
import GraphComponent from './GraphComponent';
import SearchBarComponent from './SearchBarComponent';
import {SearchResultsListComponent} from './NodeListComponents.js';
import {LeftDetailsComponent, RightDetailsComponent} from './NodeDetailsComponent.js';
import NodeSummaryComponent from './NodeSummaryComponent.js';
import ErrorDisplayComponent from './ErrorDisplayComponent.js';

class AppComponent extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        var pageHeaderRow = e('div', {className: 'row'},
                              e('div', {className: 'col-9'},
                                e('h3', null, e('i', {className: 'fa fa-eye'}, null), ` xresearch v${this.props.version} (XPiratez v${this.props.xpiratezVersion})`)),
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
        var pageFooterRow = e('div', {className: 'row'},
                              e ('div', {className: 'col-2'}),
                              e ('div', {className: 'col-8'},
                                 e('span', {style: {textAlign: 'center'}}, 'xresearch is a tool to explore and visualize research-tree info for the ',
                                   e('a', {href: 'https://openxcom.org/forum/index.php?topic=3626.0', target: '_blank'}, 'XPiratez'), ' game. It is not a product of, or endorsed by, the Xpiratez team. The source repository for this project is ', e('a', {href: 'https://github.com/olsonjeffery/xresearch', target: '_blank'}, 'available on github'), '.')),
                              e('div', {className: 'col-2'}, null));
        return e(ErrorDisplayComponent, null, pageHeaderRow, containerHeaderRow, containerRow, pageFooterRow);
    }
}
export default AppComponent;
