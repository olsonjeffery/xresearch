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
        var showAllButton = this.props.showNodeDetails ?
            e('button', {type: 'button', className: 'btn btn-default navbar-btn', onClick: this.props.onShowAllTopics, href:'#', style:{marginLeft:'4px'}}, `Show All `, e('i', { className: 'fa fa-times'}, null))
            : '';
        var nodeChevron = this.props.showNodeDetails ?
            e('i', {className: 'fa fa-chevron-right fa-fw'}, null)
            : '';
        var navbarTitle = this.props.showNodeDetails ?
            e('a', {className: 'navbar-brand'},
              nodeChevron, this.props.nodeLabel)
            : '';
        var navbarBrand =
            e('div', {className: 'navbar-header'},
              e('a', {href: "/", className: 'navbar-brand'}, eyeOrSpinner, ` xresearch v${this.props.version} (XPiratez v${this.props.xpiratezVersion})`),
              navbarTitle);
        return e('nav', {className: 'navbar navbar-default navbar-fixed-top'},
          e('div', {className: 'container-fluid'},
            navbarBrand,
            showAllButton,
            e(SearchBarComponent, {searchText: 'Enter topic name...'}, null)
           ));
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
