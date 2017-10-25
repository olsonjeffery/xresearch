(() => {
    const e = React.createElement;

    class SearchBarComponent extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            return e('div', {},
                     e('span', {className: 'search-icon'}, e('i', {className: 'fa fa-search'}, null)),
                     e('input', {id: 'search', type: 'text', value: this.props.searchText, onChange: (e) => this.props.onChange(e)}));
        }
    }

    SearchBarComponent.propTypes = {
        onChange: PropTypes.func.isRequired,
        searchText: PropTypes.string.isRequired
    };

    var mapStateToProps = (state) => {
        return {
            searchText: state.searchText
        };
    };
    var mapDispatchToProps = (dispatch, ownProps) => {
        return {
            onChange: (e) => {
                dispatch(xrActions.searchTextChange(e.currentTarget.value));
                dispatch(xrActions.sidebarModeChange(xrActions.SIDEBAR_MODE_SEARCH_RESULTS));
            }
        };
    };
    xrComponents.SearchBarComponent = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(SearchBarComponent);
})();
