import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {xrActions} from './SharedSetup.js';
import {UnlocksResultsListComponent, GetOneFreeResultsListComponent, NodeLinkListComponent}  from './NodeListComponents.js';

class NodeDetailsPresentationComponent extends Component {
    render() {
        if(this.props.active) {
            return e('div', {},
                     e(NodeLinkListComponent, {edgeName: this.props.depEdgeName, titlePrefix: this.props.depTitlePrefix, titleColored: 'Green', titleSuffix: this.props.depTitleSuffix, highlightColor: '#1a1'}, null),
                     e(NodeLinkListComponent, {edgeName: this.props.unlEdgeName, titlePrefix: this.props.unlTitlePrefix, titleColored: 'Blue', titleSuffix: this.props.unlTitleSuffix, highlightColor: '#11a'}, null),
                     e(NodeLinkListComponent, {edgeName: this.props.gofEdgeName, titlePrefix: this.props.gofTitlePrefix, titleColored: 'Red', titleSuffix: this.props.gofTitleSuffix, highlightColor: '#a11'}, null),
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
        depTitlePrefix: 'Dependencies ( ',
        depTitleColored: 'Green',
        depTitleSuffix: ' towards)',
        unlEdgeName: 'unlockedBy',
        unlTitlePrefix: 'Unlocked By (',
        unlTitleColored: 'Blue',
        unlTitleSuffix: ' towards)',
        gofEdgeName: 'giveOneFree',
        gofTitlePrefix: 'Get For Free From (',
        gofTitleSuffix: ' towards)'
    };
};

const rightMapStateToProps = (state) => {
    var active = state.sidebarMode == xrActions.SIDEBAR_MODE_NODE_DETAILS;
    // map dependencies
    return {
        active,
        depEdgeName: 'dependedUponBy',
        depTitlePrefix: 'Depended Upon By ( ',
        depTitleColored: 'Green',
        depTitleSuffix: ' away)',
        unlEdgeName: 'unlocks',
        unlTitlePrefix: 'Unlocks (',
        unlTitleColored: 'Blue',
        unlTitleSuffix: ' away)',
        gofEdgeName: 'getOneFree',
        gofTitlePrefix: 'Give One Free (',
        gofTitleSuffix: ' away)'
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export var LeftDetailsComponent = connect(leftMapStateToProps, mapDispatchToProps)(NodeDetailsPresentationComponent);
export var RightDetailsComponent = connect(rightMapStateToProps, mapDispatchToProps)(NodeDetailsPresentationComponent);
