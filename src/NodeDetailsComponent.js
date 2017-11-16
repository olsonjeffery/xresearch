import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {xrActions} from './SharedSetup.js';
import {UnlocksResultsListComponent, GetOneFreeResultsListComponent, GraphNodeTopicListComponent, ManufactureGraphNodeTopicListComponent}  from './NodeListComponents.js';

import {researchById} from './XrDataQueries.js';

const mapTopicEdgeToNodes = (targetId, edgeName) => {
    let nodes = [];
    let matchedNode = researchById(targetId);
    if(matchedNode == undefined || typeof(matchedNode[edgeName]) == 'undefined') {
        nodes = [];
    } else {
        let previousEntries = {};
        nodes = matchedNode[edgeName].filter(x=> {
            let shouldInclude = true;
            var id = x.id ? x.id : x;
            if(previousEntries[id]) {
                shouldInclude = false;
            }
            previousEntries[id] = true;
            return shouldInclude;
        }).map((x) => {
            let retVal = {};
            if(x.id) {
                let node = researchById(x.id);
                let label = node !== undefined ? node.label : x.id;
                retVal = {id: x.id, name: label, quantity: x.quantity};
            } else {
                let node = researchById(x);
                let label = node !== undefined ? node.label : x;
                retVal = {id: x, name: label};
            }
            return retVal;
        });
    }
    return nodes;
};

class RightNodeDetailsPresentationComponent extends Component {
    render() {
        if(this.props.active) {
            let topic = researchById(this.props.targetId);
            let children = [];
            if(topic.requiredItems && topic.requiredItems.length > 0) {
                children.push(e(ManufactureGraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'requiredItems')}, null));
            }
            if(topic.dependedUponBy && topic.dependedUponBy.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'dependedUponBy'), titlePrefix: 'Depended Upon By (', titleColored: 'Green', titleSuffix: ' away)', highlightColor: '#1a1'}, null));
            }
            if(topic.unlocks && topic.unlocks.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'unlocks'), titlePrefix: 'Unlocks (', titleColored: 'Blue', titleSuffix: ' away)', highlightColor: '#11a'}, null));
            }
            if(topic.getOneFree && topic.getOneFree.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'getOneFree'), titlePrefix: 'Give One Free (', titleColored: 'Red', titleSuffix: ' away)', highlightColor: '#a11'}, null));
            }
            if(topic.requiredBy && topic.requiredBy.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'requiredBy'), titlePrefix: 'Required By (', titleColored: 'Gray', titleSuffix: ' away)', highlightColor: '#aaa'}, null));
            }
            if(topic.requiredToManufacture && topic.requiredToManufacture.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'requiredToManufacture'), titlePrefix: 'Required To Manufacture (', titleColored: 'Gray', titleSuffix: ' away)', highlightColor: '#aaa'}, null));
            }
            return e('div', {}, ...children);
        }
        return null;
    }
}

RightNodeDetailsPresentationComponent.propTypes = {
    active: PropTypes.bool.isRequired
};

const rightMapStateToProps = (state) => {
    let active = state.sidebarMode == xrActions.SIDEBAR_MODE_NODE_DETAILS;
    // map dependencies
    return {
        active,
        targetId: state.selectedNodeId
    };
};

class LeftNodeDetailsPresentationComponent extends Component {
    render() {
        if(this.props.active) {
            let topic = researchById(this.props.targetId);
            let children = [];
            if(topic.dependencies && topic.dependencies.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'dependencies'), titlePrefix: 'Dependencies (', titleColored: 'Green', titleSuffix: ' towards)', highlightColor: '#1a1'}, null));
            }
            if(topic.unlockedBy && topic.unlockedBy.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'unlockedBy'), titlePrefix: 'Unlocked By (', titleColored: 'Blue', titleSuffix: ' towards)', highlightColor: '#11a'}, null));
            }
            if(topic.giveOneFree && topic.giveOneFree.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'giveOneFree'), titlePrefix: 'Get For Free From (', titleColored: 'Red', titleSuffix: ' towards)', highlightColor: '#a11'}, null));
            }
            if(topic.requires && topic.requires.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'requires'), titlePrefix: 'Requires (', titleColored: 'Gray', titleSuffix: ' towards)', highlightColor: '#aaa'}, null));
            }
            if(topic.requiresBuy && topic.requiresBuy.length > 0) {
                children.push(e(GraphNodeTopicListComponent, {nodes: mapTopicEdgeToNodes(this.props.targetId, 'requiresBuy'), titlePrefix: 'Requires For Purchase (', titleColored: 'Gray', titleSuffix: ' towards)', highlightColor: '#aaa'}, null));
            }
            return e('div', {}, ...children);
        }
        return null;
    }
}

LeftNodeDetailsPresentationComponent.propTypes = {
    active: PropTypes.bool.isRequired
};

const leftMapStateToProps = (state) => {
    let active = state.sidebarMode == xrActions.SIDEBAR_MODE_NODE_DETAILS;
    // map dependencies
    return {
        targetId: state.selectedNodeId,
        active
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export let LeftDetailsComponent = connect(leftMapStateToProps, mapDispatchToProps)(LeftNodeDetailsPresentationComponent);
export let RightDetailsComponent = connect(rightMapStateToProps, mapDispatchToProps)(RightNodeDetailsPresentationComponent);
