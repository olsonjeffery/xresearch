import { createElement as e, Component } from 'react';
import GraphComponent from './GraphComponent';
import {SearchResultsListComponent} from './NodeListComponents.js';
import {LeftDetailsComponent, RightDetailsComponent} from './NodeDetailsComponent.js';
import ErrorDisplayComponent from './ErrorDisplayComponent.js';
import PageNavComponent from './PageNavComponent.js';

class AppComponent extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        var pageNav = e(PageNavComponent, {version: this.props.version, xpiratezVersion: this.props.xpiratezVersion}, null);

        var containerRow = e('div', {className: 'row'},
                             e('div', {className: 'col-xs-3'},
                               e(LeftDetailsComponent, {}, null)),
                             e('div', {className: 'col-xs-6'},
                               e(GraphComponent, {}, null)),
                             e('div', {className: 'col-xs-3'},
                               e(SearchResultsListComponent, {active: false, nodes: [], title: 'Search Results'}, null),
                               e(RightDetailsComponent, {}, null)));
        var pageFooterRow = e('div', {className: 'row'},
                              e ('div', {className: 'col-xs-2'}),
                              e ('div', {className: 'col-xs-8'},
                                 e('span', {style: {textAlign: 'center'}}, 'xresearch is a tool to explore and visualize research-tree info for the ',
                                   e('a', {href: 'https://openxcom.org/forum/index.php?topic=3626.0', target: '_blank'}, 'XPiratez'), ' game. It is not a product of, or endorsed by, the Xpiratez team. The source repository for this project is ', e('a', {href: 'https://github.com/olsonjeffery/xresearch', target: '_blank'}, 'available on github'), '.')),
                              e('div', {className: 'col-xs-2'}, null));
        var app = e(ErrorDisplayComponent, null, containerRow, pageFooterRow);
        return e('div', {className: 'fluid-container'}, pageNav, app);
    }
}
export default AppComponent;
