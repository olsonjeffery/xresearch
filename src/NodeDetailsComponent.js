import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import xrActions from './SharedSetup.js';
import nodeLists from './NodeListComponents.js';
const {DependenciesResultsListComponent} = nodeLists;

class NodeDetailsPresentationComponent extends Component {
    render() {
        if(this.props.active) {
            return e('div', {},
                        e('h3', {}, `${this.props.name} (${this.props.id})`),
                        e(DependenciesResultsListComponent, {title: 'Dependencies', store: this.props.store}, null));
        }
        return null;
    }
}

NodeDetailsPresentationComponent.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
    var active = state.sidebarMode == xrActions.SIDEBAR_MODE_NODE_DETAILS;
    // map dependencies
    return {
        id: state.selectedNodeId == null ? '' : state.selectedNodeId,
        name: state.selectedNodeId == null ? '' : state.xrData.researchData[state.xrData.keysIndexMap[state.selectedNodeId]].label,
        active
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailsPresentationComponent);
