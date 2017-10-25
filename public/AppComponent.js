(() => {
    const e = React.createElement;

    class AppComponent extends React.Component {
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
                                e(xrComponents.SearchBarComponent, {store: this.props.store, searchText: 'Enter topic name...'}, null)));
            var containerRow = e('div', {className: 'row'},
                              e('div', {className: 'col-9'},
                                e(xrComponents.GraphComponent, {data: this.props.data}, null)),
                              e('div', {className: 'col-3'},
                                e(xrComponents.SearchResultsListComponent, {store: this.props.store, active: false, nodes: [], title: 'Search Results'}, null),
                                e(xrComponents.NodeDetailsComponent, {store: this.props.store, active: false, id: -1, name: ''})));
            return e('div', null, headerRow, containerRow);
        }
    }
    xrComponents.AppComponent = AppComponent;
})();
