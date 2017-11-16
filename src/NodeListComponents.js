import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import lunr from 'lunr';

import {allResearchData, researchById, isTopicInGraphNodes} from './XrDataQueries.js';
import {xrActions} from './SharedSetup';

class ManufactureSidebarNodeListCompoent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.active) {
            var headerContent = e('h4', {}, 'Manufacturing Requirements');
            var entries = this.props.nodes.map((x) => {
                var content = isTopicInGraphNodes(x.id) ? e('a', {href: '#', "data-id": x.id, onClick: this.props.onNodeSelection}, `${x.name}`) : x.name;
                return e('li', {key: `sidebar-node-${x.id}`}, content, ` x${x.quantity}`);
            });
            return e('div', {}, headerContent,
                     entries.length == 0 ? e('p', {}, 'None') : e('ul', {}, entries));
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
                e('h4', {}, this.props.title)
                : e('h4', {}, this.props.titlePrefix, e('span', {style:{color:this.props.highlightColor}}, this.props.titleColored), this.props.titleSuffix, e('input', {type:'checkbox', onChange: (e)=> this.props.onFilterToggle(e), checked: this.props.isChecked}));
            var entries = this.props.nodes.map((x) => {
                var content = isTopicInGraphNodes(x.id) ? e('a', {href: '#', "data-id": x.id, onClick: this.props.onNodeSelection}, `${x.name}`) : x.name;
                return e('li', {key: `sidebar-node-${x.id}`}, content);
            });
            return e('div', {}, headerContent,
                        entries.length == 0 ? e('p', {}, 'None') : e('ul', {}, entries));
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

// FIXME this search stuff should be factored into its own module
var lunrIndex = null;
var buildNodeListFromSearch = (searchText) => {
    if(lunrIndex == null) {
        lunrIndex = lunr(function() {
            this.field("name");

            _.each(allResearchData(), x => {
                var name = x.id;
                if(x.label != undefined) {
                    name = x.label.toLowerCase();
                    this.add({id: x.id, name: x.id});
                }
                this.add({id: x.id, name});
            });
        });
    }
    if (searchText == '') {
        return [];
    }
    var results = lunrIndex.search(`*${searchText.toLowerCase()}*`).map((x)=> {
        var targetNode = researchById(x.ref);
        return {id: x.ref, name: targetNode.label};
    });
    if(results.length > 40) {
        return [];
    }
    return results;
};

const resultsMapStateToProps = (state) => {
    var active = state.sidebarMode == xrActions.SIDEBAR_MODE_SEARCH_RESULTS;
    var nodes = [];
    if(active) {
        // this should be the filtering/search based on the current search text (lunr.js)
        nodes = buildNodeListFromSearch(state.searchText);
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
            dispatch(xrActions.nodeSelection(e.currentTarget.getAttribute("data-id")));
            dispatch(xrActions.sidebarModeChange(xrActions.SIDEBAR_MODE_NODE_DETAILS));
        },
        onFilterToggle: (e) => {
            var newValue = e.target.checked;
            dispatch(xrActions.graphFilteringCategoryChange(ownProps.edgeName, newValue));
        }
    };
};

export var SearchResultsListComponent =  connect(resultsMapStateToProps, mapDispatchToProps)(SidebarNodeListCompoent);
export var GraphNodeTopicListComponent = connect(nodeLinkMapStateToProps, mapDispatchToProps)(SidebarNodeListCompoent);
export var ManufactureGraphNodeTopicListComponent = connect(nodeLinkMapStateToProps, mapDispatchToProps)(ManufactureSidebarNodeListCompoent);
