import { createElement as e, Component } from 'react';
import gc from './GraphComponent';
const { GraphComponent } = gc;
import SearchBarComponent from './SearchBarComponent';
import nodeLists from './NodeListComponents.js';
import NodeDetailsComponent from './NodeDetailsComponent.js';

class AppComponent extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
    }
    componentDidMount() {
    }
    render() {
        var headerRow = e('div', {className: 'row'},
                            e('div', {className: 'col-9'},
                            e('h3', null, e('i', {className: 'fa fa-eye'}, null), ' XPiratez Research Tree Explorer (xresearch)')),
                            e('div', {className: 'col-3', style: {paddingTop: '15px'} },
                            e(SearchBarComponent, {store: this.props.store, searchText: 'Enter topic name...'}, null)));
        var containerRow = e('div', {className: 'row'},
                            e('div', {className: 'col-9'},
                            e(GraphComponent, {data: this.props.data}, null)),
                            e('div', {className: 'col-3'},
                            e(nodeLists.SearchResultsListComponent, {store: this.props.store, active: false, nodes: [], title: 'Search Results'}, null),
                            e(NodeDetailsComponent, {store: this.props.store, active: false, id: '', name: ''})));
        return e('div', null, headerRow, containerRow);
    }
}
export default AppComponent;
