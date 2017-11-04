import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import lunr from 'lunr';

import {xrActions} from './SharedSetup';

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
                return e('li', {key: `sidebar-node-${x.id}`}, e('a', {href: '#', "data-id": x.id, onClick: this.props.onNodeSelection}, `${x.name}`));
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
            name: PropTypes.string.isRequired
        })
    ),
    onNodeSelection: PropTypes.func.isRequired
};

// FIXME this search stuff should be factored into its own module
var lunrIndex = null;
export var getLabelFromXrData = (xrData, id) => {
    var keyIdx = xrData.keysIndexMap[id];
    if(keyIdx == undefined) {
        // FIXME: the key is probably coming from vanilla
        return id;
    }
    else if(xrData.researchData[xrData.keysIndexMap[id]].label == undefined) {
        return id;
    } else {
        return xrData.researchData[xrData.keysIndexMap[id]].label;
    }
};
var buildNodeListFromSearch = (xrData, searchText) => {
    if(lunrIndex == null) {
        lunrIndex = lunr(function() {
            this.field("name");

            _.each(xrData.researchData, x => {
                var name = x.id;
                if(x.label != undefined) {
                    name = x.label.toLowerCase();
                }
                this.add({id: x.id, name});
            });
        });
    }
    if (searchText == '') {
        return [];
    }
    var results = lunrIndex.search(`*${searchText.toLowerCase()}*`).map((x)=> {
        return {id: x.ref, name: getLabelFromXrData(xrData, x.ref)};
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
        nodes = buildNodeListFromSearch(state.xrData, state.searchText);
    }
    return {active, nodes};
};

const nodeLinkMapStateToProps = (state, ownProps) => {
    var active = state.sidebarMode == xrActions.SIDEBAR_MODE_NODE_DETAILS;
    var edgeName = ownProps.edgeName;
    var nodes = [];
    if(active) {
        var matchedNode = state.xrData.researchData[state.xrData.keysIndexMap[state.selectedNodeId]];
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
                if(x == 'STR_BUGEYE_VICTIM') {
                    console.log('lol got em');
                }
                return {id: x, name: getLabelFromXrData(state.xrData, x)};
            });
        }
    }
    return {active, nodes, edgeName, isChecked: state.graphFilteringCategories[edgeName]};
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
export var NodeLinkListComponent = connect(nodeLinkMapStateToProps, mapDispatchToProps)(SidebarNodeListCompoent);
