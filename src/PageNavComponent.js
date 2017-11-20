import { createElement as e, Component } from 'react';
import { connect } from 'react-redux';
import SearchBarComponent from './SearchBarComponent';
import {researchById} from './XrDataQueries.js';
import {nodeSelection} from './StateManagement.js';

class PageNavComponentImpl extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var eyeOrSpinner = this.props.graphUpdating ?
            e('i', {className: 'fa fa-refresh fa-spin fa-fw'}, null)
            : e('i', {className: 'fa fa-eye fa-fw'}, null);
        var navbarPageTitle =
            e('a', {href: "/", className: ''}, eyeOrSpinner, ` xresearch v${this.props.version} (XPiratez v${this.props.xpiratezVersion})`);
        var navbarSelectedTitle = this.props.showNodeDetails ?
            e('a', {className: ''},
              e('i', {className: 'fa fa-chevron-right fa-fw'}, null), this.props.nodeLabel)
            : '';
        var showAllButton = this.props.showNodeDetails ?
            e('a', {href:'#', className: '', onClick: this.props.onShowAllTopics}, e('i', { className: 'fa fa-times fa-fw'}, null))
            : '';
        return e('nav', {className: 'navbar navbar-expand-lg navbar-dark bg-primary'},
                 e('div', {className: 'navbar-brand'},
                   navbarPageTitle,
                   navbarSelectedTitle,
                   showAllButton),
                 e('button', {type:'button', className:'navbar-toggler collapsed', "data-target":"#navbarResponsive", "data-toggle":"collapse", "aria-controls":"navbarResponsive", "aria-expanded":"false", "aria-label":"Toggle navigation"}, e('span', {className: 'navbar-toggler-icon'})),
                 e('div', {id: "navbarResponsive", className:'navbar-collapse collapse'},
                   e(SearchBarComponent, {searchText: 'Enter topic name...'}, null)));
    }
}

const mapStateToProps = (state, ownProps) => {
    var showNodeDetails = false;
    var nodeLabel = '';
    if(state.selectedNodeId != null) {
        var node = researchById(state.selectedNodeId);
        nodeLabel = node.label === node.id ? node.label
            : `${node.label} (${node.id})`;
        showNodeDetails = true;
    }
    return {
        showNodeDetails,
        nodeLabel,
        graphUpdating: state.graphUpdating
    };
};

const mapDispatchToProps = (dispatch, state, ownProps) => {
    return {
        onShowAllTopics: () => {
            dispatch(nodeSelection(null));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageNavComponentImpl);
