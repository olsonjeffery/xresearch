import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {allResearchData, researchById, isTopicInGraphNodes} from './XrDataQueries.js';
import Constants from './Constants.js';
import {nodeSelection, graphFilteringCategoryChange} from './StateManagement.js';
import {parseBuildTime} from './Utility.js';
import {topicsBySearchText} from './PassiveServices.js';

const genericAsideTableBuilder = (thElems, trElemsInput) => {
    var trElems = trElemsInput.length > 0 ?
        trElemsInput
        : [genericSidebarClickableRow({id: "-1", content: "None"}, null)];
    return e('table', {style: {marginBottom: '30px'},className: 'table-dark xr-shadow table-sm table table-striped table-hover table-border'},
             e('thead', {className: 'thead-dark'},
               e('tr', {}, ...thElems)),
             e('tbody',{},
               ...trElems));
};

const genericSidebarClickableRow = (data, onClick) => {
    var cellConfig = isTopicInGraphNodes(data.id) && onClick != null ? {onClick, "data-id": data.id} : {};
    return e('tr', {key: `sidebar-node-${data.id}`},
             e('td', cellConfig, e('a', {href:'#'}, data.content)));
};

const genericSidebarPlainTextRow = (text) => {
    return e('tr', {}, e('td', {}, text));
};

class ManufactureSidebarNodeListCompoent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.active) {
            var headerContent = [e('th', {}, 'Manufacturing Requirements')];
            var entries = this.props.nodes.map((x) => {
                return genericSidebarClickableRow({id: x.id, content:`${x.name} x${x.quantity}`}, this.props.onNodeSelection);
            });
            return genericAsideTableBuilder(headerContent, entries);
        }
        return null;
    }
}

class SidebarNodeListCompoent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.active) {
            var headerContent = this.props.title != undefined ?
                [e('th', {}, this.props.title)]
                : [e('th', {style:{color:this.props.highlightColor}}, this.props.titlePrefix,this.props.titleSuffix, e('input', {className:'mr-auto',type:'checkbox', onChange: (e)=> this.props.onFilterToggle(e), checked: this.props.isChecked}))];
            var entries = this.props.nodes.map((x) => {
                return genericSidebarClickableRow({id: x.id, content: `${x.name}`}, this.props.onNodeSelection);
            });
            return genericAsideTableBuilder(headerContent, entries);
        }
        return null;
    }
}

SidebarNodeListCompoent.propTypes = {
    active: PropTypes.bool.isRequired,
    nodes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            quantity: PropTypes.number
        })
    ),
    onNodeSelection: PropTypes.func.isRequired
};

class NodeTriviaListViewComponent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.active) {
            var headerContent = [e('th', {}, 'Information')];
            var trElems = [`Ruleset Key: ${this.props.selectedNodeId}`];

            var topic = researchById(this.props.selectedNodeId);
            if(topic === undefined || topic == null) {
                trElems.push('No further info: Topic not in ruleset data');
            } else {
                if(topic.costResearch) trElems.push(` Research (Base): ${ topic.costResearch }pts.`);
                if(topic.costManufacture) trElems.push(` Manufacture: $${ topic.costManufacture }`);
                if(topic.costBuy) trElems.push(`Buy: $${ topic.costBuy }`);
                if(topic.costSell) trElems.push(` Sell: $${ topic.costSell }`);
                if(topic.costBuild) trElems.push(` Build: $${topic.costBuild}`);
                if(topic.points) trElems.push(`Score Points: ${ topic.points }`);
                if(topic.timeTotalManufacture) trElems.push(` Manufacture Time: ${parseBuildTime(topic.timeTotalManufacture)}`);
                if(topic.timeBuild) trElems.push(` Build Time: ${parseBuildTime(topic.timeBuild)}`);
            }

            return genericAsideTableBuilder(headerContent, trElems.map(x=>genericSidebarPlainTextRow(x)));
        }
        return null;
    }
}

var nodeTriviaMapStateToProps = (state, ownProps) => {
    var active = state.selectedNodeId !== null;
    var selectedNodeId = state.selectedNodeId;
    return {active, selectedNodeId};
};

var nodeTriviaMapDispatchToProps = () => {return{};};

const searchResultsMapStateToProps = (state) => {
    var active = state.sidebarMode == Constants.SIDEBAR_MODE_SEARCH_RESULTS;
    var nodes = [];
    if(active) {
        // this should be the filtering/search based on the current search text (lunr.js)
        nodes = topicsBySearchText(state.searchText);
    }
    return {active, nodes};
};

const nodeLinkMapStateToProps = (state, ownProps) => {
    var edgeName = ownProps.edgeName;
    var nodes = [];
    var matchedNode = researchById(state.selectedNodeId);
    if(matchedNode == undefined || typeof(matchedNode[edgeName]) == 'undefined') {
        nodes = [];
    } else {
        var previousEntries = {};
        nodes = matchedNode[edgeName].filter(x=> {
            var shouldInclude = true;
            if(previousEntries[x]) {
                shouldInclude = false;
            }
            previousEntries[x] = true;
            return shouldInclude;
        }).map((x) => {
            var node = researchById(x);
            var label = node !== undefined ? node.label : x;
            return {id: x, name: label};
        });
    }

    return {active: true, isChecked: state.graphFilteringCategories[edgeName]};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onNodeSelection: (e) => {
            dispatch(nodeSelection(e.currentTarget.getAttribute("data-id")));
        },
        onFilterToggle: (e) => {
            var newValue = e.target.checked;
            dispatch(graphFilteringCategoryChange(ownProps.edgeName, newValue));
        }
    };
};

export var SearchResultsListComponent =  connect(searchResultsMapStateToProps, mapDispatchToProps)(SidebarNodeListCompoent);
export var GraphNodeTopicListComponent = connect(nodeLinkMapStateToProps, mapDispatchToProps)(SidebarNodeListCompoent);
export var ManufactureGraphNodeTopicListComponent = connect(nodeLinkMapStateToProps, mapDispatchToProps)(ManufactureSidebarNodeListCompoent);
export var NodeTriviaListComponent = connect(nodeTriviaMapStateToProps, nodeTriviaMapDispatchToProps)(NodeTriviaListViewComponent);
