import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {xrActions} from './SharedSetup.js';
import {UnlocksResultsListComponent, GetOneFreeResultsListComponent, NodeLinkListComponent}  from './NodeListComponents.js';

class NodeDetailsPresentationComponent extends Component {
    render() {
        if(this.props.active) {
            return e('div', {},
                     e(NodeLinkListComponent, {edgeName: this.props.depEdgeName, title: this.props.depTitle}, null),
                     e(NodeLinkListComponent, {edgeName: this.props.unlEdgeName, title: this.props.unlTitle}, null),
                     e(NodeLinkListComponent, {edgeName: this.props.gofEdgeName, title: this.props.gofTitle}, null),
                    );
        }
        return null;
    }
}

NodeDetailsPresentationComponent.propTypes = {
    active: PropTypes.bool.isRequired
};

const leftMapStateToProps = (state) => {
    var active = state.sidebarMode == xrActions.SIDEBAR_MODE_NODE_DETAILS;
    // map dependencies
    return {
        active,
        depEdgeName: 'dependencies',
        depTitle: 'Dependencies (Green towards)',
        unlEdgeName: 'unlockedBy',
        unlTitle: 'Unlocked By (Blue towards)',
        gofEdgeName: 'giveOneFree',
        gofTitle: 'Get For Free From (Red towards)'
    };
};

const rightMapStateToProps = (state) => {
    var active = state.sidebarMode == xrActions.SIDEBAR_MODE_NODE_DETAILS;
    // map dependencies
    return {
        active,
        depEdgeName: 'dependedUponBy',
        depTitle: 'Depended Upon By (Green away)',
        unlEdgeName: 'unlocks',
        unlTitle: 'Unlocks (Blue away)',
        gofEdgeName: 'getOneFree',
        gofTitle: 'Gives One Free (Red away)'
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export var LeftDetailsComponent = connect(leftMapStateToProps, mapDispatchToProps)(NodeDetailsPresentationComponent);
export var RightDetailsComponent = connect(rightMapStateToProps, mapDispatchToProps)(NodeDetailsPresentationComponent);
