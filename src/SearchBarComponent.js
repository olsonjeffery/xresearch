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
        return e('form', {className: 'form-inline my-2 ml-auto'},
                 e('div', {className: 'input-group mr-sm-2'},
                   e('span', {className: 'input-group-addon'}, e('i', {className: 'fa fa-search'}, null)),
                   e('input', {id: 'search', className: 'form-control form-control-sm mr-sm-2', type: 'text', placeholder: this.props.searchText, onChange: (e) => this.props.onChange(e)})));
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
                dispatch(searchTextChange(e.currentTarget.value));
            }
        };
    };

    export default connect(mapStateToProps, mapDispatchToProps)(SearchBarComponent);
