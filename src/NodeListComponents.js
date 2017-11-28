import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {allResearchData, researchById, isTopicInGraphNodes} from './XrDataQueries.js';
import {Constants} from './Constants.js';
import {nodeSelection, graphFilteringCategoryChange} from './StateManagement.js';
import {parseBuildTime} from './Utility.js';
import {topicsBySearchText} from './PassiveServices.js';

const buildNodeListTable = (thElems, trElemsInput, showHover = true, isCollapsed = false) => {
    var trElems = trElemsInput.length > 0 ?
        trElemsInput
        : [({id: "-1", content: "None"}, null)];
    trElems = isCollapsed ? [] : trElems;
    return e('table', {style: {marginBottom: '30px'},className: `table-dark xr-shadow table-sm table table-striped ${ showHover ? 'table-hover' : ''} table-border`},
             e('thead', {className: 'thead-dark'},
               e('tr', {}, ...thElems)),
             e('tbody',{},
               ...trElems));
};

const buildNodeListTableHeader = (content, color = null) => {
    let config = {};
    if(color != null) {
        config.style = {color};
    }
    return [e('th', config, ...content)];
};

const buildCollapsableControl = (targetInst) => {
    const onToggleCollapse = () => {
        targetInst.setState({isCollapsed: !targetInst.state.isCollapsed});
    };
    let chevron = e('i', {className: 'fa fa-chevron-circle-down', style: {color:'#fff'}, onClick: onToggleCollapse}, null);
    if(targetInst.state.isCollapsed || (targetInst.props.isChecked != undefined && targetInst.props.isChecked === false)) {
        let config = {className: 'fa fa-chevron-circle-right', style: {color:'#fff'}};
        if(targetInst.props.isChecked == undefined || (targetInst.props.isChecked != undefined && targetInst.props.isChecked === true)) {
            config.onClick = onToggleCollapse;
        }
        chevron = e('i', config, null);
    }
    return [chevron, ' '];
};

const buildSidebarClickableRow = (data, onClick) => {
    var cellConfig = isTopicInGraphNodes(data.id) && onClick != null ? {onClick, "data-id": data.id} : {};
    return e('tr', {key: `sidebar-node-${data.id}`},
             e('td', cellConfig, e('a', {href:'#'}, data.content)));
};

const buildSidebarPlaintextRow = (contentArr, style = null) => {
    let config = {};
    if(style != null) {
        config.style = style;
    }

    return e('tr', config, e('td', {}, ...contentArr));
};

const buildLeftAndRightAlignedContent = (leftContent, rightContent, maxLeftWidth=80, maxRightWidth=20) => {
    return [e('div', {style:{float:'left',maxWidth:`${maxLeftWidth}%`, textAlign:'left'}}, ...leftContent),
            e('div', {style:{float:'right',maxWidth:`${maxRightWidth}%`, textAlign:'right'}}, ...rightContent)];
};

const buildRuntAugmentedManufactureTime = (timeTotalManufacture, targetInst) => {
    const onRuntCountChange = (e) => {
        var runts = parseInt(e.target.value);
        targetInst.setState({runts});
    };
    return buildLeftAndRightAlignedContent(
        [`Manufacture Time: ${parseBuildTime(timeTotalManufacture, targetInst.state.runts)}`],
        [e('input', {style: {display:'inline', maxWidth:'50%'}, className: 'form-control form-control-sm', type:'number', onChange: onRuntCountChange, value: `${targetInst.state.runts}`, min:'1', max:'1024'}), ' Runt(s)'],
        65, 35);
};

class CollapsableNodeListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {isCollapsed: false};
    }

    onToggleCollapse(e) {
        this.setState({state: !this.state.isCollapsed});
    }
}

class ManufactureSidebarNodeListCompoent extends CollapsableNodeListComponent {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.active) {
            var headerContent = buildNodeListTableHeader([...buildCollapsableControl(this), 'Manufacturing Requirements'], Constants.COLOR_ORANGE);
            var rowEntries = this.props.nodes.map((x) => {
                return buildSidebarClickableRow({id: x.id, content:`${x.name} x${x.quantity}`}, this.props.onNodeSelection);
            });
            return buildNodeListTable(headerContent, rowEntries, true, this.state.isCollapsed);
        }
        return null;
    }
}

class SidebarNodeListCompoent extends CollapsableNodeListComponent {
    constructor(props) {
        super(props);
    }
    render() {
        let isSearchResults = this.props.title != undefined;
        if(this.props.active) {
            let headerContent = isSearchResults ?
                buildNodeListTableHeader([...buildCollapsableControl(this), this.props.title])
                : buildNodeListTableHeader(
                    buildLeftAndRightAlignedContent(
                        [...buildCollapsableControl(this), this.props.titlePrefix,this.props.titleSuffix],
                        [e('input', {className:'ml-auto',type:'checkbox', onChange: (e)=> this.props.onFilterToggle(e), checked: this.props.isChecked}, null)]),
                    this.props.highlightColor);
            let rowEntries = this.props.nodes.map((x) => {
                return buildSidebarClickableRow({id: x.id, content: `${x.name}`}, this.props.onNodeSelection);
            });
            return buildNodeListTable(headerContent, rowEntries, true, this.state.isCollapsed || this.props.isChecked === false);
        }
        return null;
    }
}

class NodeTriviaListViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {runts: 1};
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
                if(topic.costSell) trElems.push(`Sell: $${ topic.costSell }`);
                if(topic.costBuild) trElems.push(`Build: $${topic.costBuild}`);
                if(topic.points) trElems.push(`Score Points: ${ topic.points }`);
                if(topic.timeTotalManufacture) trElems.push([...buildRuntAugmentedManufactureTime(topic.timeTotalManufacture, this)]);
                if(topic.timeBuild) trElems.push(`Build Time: ${parseBuildTime(topic.timeBuild)}`);
            }

            const rowMapper = (x)=> {
                return buildSidebarPlaintextRow(Array.isArray(x) ? x : [x]);
            };
            return buildNodeListTable(headerContent, trElems.map(rowMapper), false, false);
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

let previousSearchText = null;
const searchResultsMapStateToProps = (state) => {
    var active =  state.searchText != Constants.DEFAULT_SEARCHTEXT && state.searchText != '' && state.searchText != previousSearchText;
    var nodes = [];
    if(active) {
        // this should be the filtering/search based on the current search text (lunr.js)
        nodes = topicsBySearchText(state.searchText);
    }
    return {active, nodes, isChecked: true};
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

export const SearchResultsListComponent =  connect(searchResultsMapStateToProps, mapDispatchToProps)(SidebarNodeListCompoent);
export const GraphNodeTopicListComponent = connect(nodeLinkMapStateToProps, mapDispatchToProps)(SidebarNodeListCompoent);
export const ManufactureGraphNodeTopicListComponent = connect(nodeLinkMapStateToProps, mapDispatchToProps)(ManufactureSidebarNodeListCompoent);
export const NodeTriviaListComponent = connect(nodeTriviaMapStateToProps, nodeTriviaMapDispatchToProps)(NodeTriviaListViewComponent);
