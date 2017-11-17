import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {searchTextChange} from './StateManagement.js';
import Constants from './Constants.js';

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
            dispatch(searchTextChange(e.currentTarget.value));
        },
        onClick: (e) => {
            if(e.currentTarget.value == Constants.DEFAULT_SEARCHTEXT) {
                dispatch(searchTextChange(''));
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarComponent);
