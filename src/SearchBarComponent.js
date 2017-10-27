import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import xrActions from './SharedSetup.js';

class SearchBarComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e('div', {},
                    e('span', {className: 'search-icon'}, e('i', {className: 'fa fa-search'}, null)),
                 e('input', {id: 'search', type: 'text', value: this.props.searchText, onChange: (e) => this.props.onChange(e), onClick: (e) => this.props.onClick(e)}));
    }
}

SearchBarComponent.propTypes = {
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
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
        },
        onClick: (e) => {
            if(e.currentTarget.value == xrActions.DEFAULT_SEARCHTEXT) {
                dispatch(xrActions.searchTextChange(''));
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarComponent);
