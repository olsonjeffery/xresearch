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
                                e('span', {className: 'search-icon'}, e('i', {className: 'fa fa-search'}, null)),
                                e('input', {id: 'search', type: 'text', value: 'Search text!', readOnly: true})));
            var containerRow = e('div', {className: 'row'},
                              e('div', {className: 'col-9'},
                                e(xrComponents.GraphComponent, {data: this.props.data}, null)),
                              e('div', {className: 'col-3'},
                                e('p', null, 'sidebar views go here')));
            return e('div', null, headerRow, containerRow);
        }
    }
    xrComponents.AppComponent = AppComponent;
})();
