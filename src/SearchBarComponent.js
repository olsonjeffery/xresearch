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
        return e('form', {className: 'navbar-form navbar-right'},
                 e('div', {className: 'input-group'},
                   e('span', {className: 'input-group-addon'}, e('i', {className: 'fa fa-search'}, null)),
                   e('input', {id: 'search', className: 'form-control col-lg-8', type: 'text', placeholder: this.props.searchText, onChange: (e) => this.props.onChange(e)})));
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
