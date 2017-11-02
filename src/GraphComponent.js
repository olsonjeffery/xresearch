import {Component, createElement as e} from 'react';
import cytoscape from 'cytoscape';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _ from 'lodash';

import {xrActions} from './SharedSetup';

var dupeTopics = [];
const TIMEOUT_LENGTH_MS = 100;
var buildElements = (data) => {
    var addedTopics = {};
    dupeTopics = [];
    var elements = [];
    var researchData = data.researchData;
    _.each(researchData, function(topic, idx) {
        if(addedTopics[topic.id]) {
            dupeTopics.push(topic.id);
            // we have to bail because this is a repeat
            return true;
        }
        addedTopics[topic.id] = true;

        // add node here
        elements.push({
            data: {
                id: topic.id,
                name: topic.label == undefined ? topic.id : topic.label,
                weight: idx
            },
            classes: topic.needItem ? 'idea' : 'item'
        });
        return true;
    });

    const addEdge = (dep, topicId, edgeClass, idx) => {
        // this is for nodes that aren't in the topics tree (possibly they are from vanilla or events like STR_ALIEN_TERROR, etc)
        if(!addedTopics[dep]) {
            elements.push({
                data: {
                    id: dep,
                    name: dep,
                    weight: idx
                },
                classes: 'event'
            });
            addedTopics[dep] = true;
        }
        if(addedTopics[topicId] && addedTopics[dep]) {
            elements.push({
                data: {
                    id: dep+"->"+topicId,
                    target: topicId,
                    source: dep
                },
                classes: edgeClass
            });
        }
    };

    // a second traversal to add edges; we can't do this until we
    // know what all of the topics are
    _.each(researchData, (topic, idx) => {
        if(topic.dependencies) {
            _.each(topic.dependencies, function(dep) {
                addEdge(dep, topic.id, 'dep', idx);
            });
        }
        if(topic.unlocks) {
            _.each(topic.unlocks, function(dep) {
                addEdge(dep, topic.id, 'unlocks', idx);
            });
        }
        if(topic.requires) {
            _.each(topic.requires, function(dep) {
                // these are events mostly
                addEdge(dep, topic.id, 'requires', idx);
            });
        }
        if(topic.getOneFree) {
            _.each(topic.getOneFree, function(dep) {
                addEdge(dep, topic.id, 'getOneFree', idx);
            });
        }
    });
    return elements;
};

var cyStyle = [
    // edge styles
    {"selector": ".dep",
     "style": {
         "width": "1px",
         "line-color": "#1a1",
         "mid-target-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-target-arrow-shape": "triangle",
         "mid-target-arrow-color": "#1a1"
     }},
    {"selector": ".unlocks",
     "style": {
         "width": "1px",
         "line-color": "#11a",
         "mid-source-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-source-arrow-shape": "triangle",
         "mid-source-arrow-color": "#11a"
     }},
    {"selector": ".getOneFree",
     "style": {
         "width": "1px",
         "line-color": "#a11",
         "mid-source-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-source-arrow-shape": "triangle",
         "mid-source-arrow-color": "#a11"
     }},
    {"selector": ".requires",
     "style": {
         "width": "1px",
         "line-color": "#aaa",
         "mid-target-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-target-arrow-shape": "triangle",
         "mid-target-arrow-color": "#aaa"
     }},
    // node styles
    {"selector": "node.idea",
     "style": {
         "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "content": "data(name)",
         "font-size": "9px",
         "text-valign": "center",
         "text-halign": "center",
         "background-color": "green",
         "text-outline-color": "#555",
         "text-outline-width": "1px",
         "color": "#fff",
         "overlay-padding": "6px",
         "z-index": "10",
         shape: "rectangle"
     }},
    {"selector": "node.item",
     "style": {
         "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "content": "data(name)",
         "font-size": "9px",
         "text-valign": "center",
         "text-halign": "center",
         "background-color": "blue",
         "text-outline-color": "#555",
         "text-outline-width": "1px",
         "color": "#fff",
         "overlay-padding": "6px",
         "z-index": "10",
         shape: "ellipse"
     }},
    {"selector": "node.event",
     "style": {
         "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "content": "data(name)",
         "font-size": "9px",
         "text-valign": "center",
         "text-halign": "center",
         "background-color": "#ccc",
         "text-outline-color": "#555",
         "text-outline-width": "1px",
         "color": "#fff",
         "overlay-padding": "6px",
         "z-index": "10",
         shape: "pentagon"
     }}
];

var coseLayout = {
    name: 'cose',
    padding: 20,
    fit: true,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
};

var concentricTotalLayout = {
    name: 'concentric',
    concentric: function( ele ){ return ele.data('weight'); },
    levelWidth: function( nodes ){ return nodes.length / 80; },
    padding: 100,
    fit: false,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
};
var randomLayout = {
    name: 'random',
    padding: 10,
    fit: false,
    avoidOverlap: false,
    nodeDimensionsIncludeLabels: false
};

var __allElems = {};

class GraphComponent extends Component {
    constructor(props) {
        super(props);
        this.containerId = 'cy-container';
    }

    componentDidMount() {
        var self = this;
        self.props.dispatch(xrActions.graphUpdatingChange(true));
        setTimeout(() => {
            self.cyQuery = cytoscape({
                headless: true,
                elements: buildElements(this.props.xrData),
                layout: concentricTotalLayout,
                style: cyStyle
            });
            setTimeout(() => {
                self.cy = cytoscape({
                    container: document.getElementById(this.containerId),
                    elements: [],
                    layout: null,
                    style: cyStyle
                });
                window.__cy = self.cy;
                self.cy.add(self.cyQuery.elements());
                var layout = self.cy.layout(concentricTotalLayout);
                layout.run();
                self.cy.reset();
                self.cy.on('tap', 'node', (e) => {
                    self.props.onNodeSelection(e);
                });
                self.props.dispatch(xrActions.graphUpdatingChange(false));
            }, TIMEOUT_LENGTH_MS);
            window.__cyQuery = self.cyQuery;
        }, TIMEOUT_LENGTH_MS);
    }

    render() {
        return e('div', {},
                 e('div', {id: this.containerId}, null));
    }
}

var previousSelectedNodeId = null;
var previousGraphFilteringCateogories = {};
const applyGraphFilteringCategories = (cy, targetNode, filteringCategories, category) => {
    if(!filteringCategories[category]) {
        _.each(targetNode[category], id =>
               cy.$(`#${id}`).remove());
    }
};
const showSelectedNodeInGraph = (targetId, self, xrData) => {
    var newNodes = [];
    var selectedLayout = {};
    self.props.dispatch(xrActions.graphUpdatingChange(true));
    if(targetId === null) {
        //show all topics
        newNodes = window.__cyQuery.elements();
        selectedLayout = concentricTotalLayout;
    } else {
        newNodes = window.__cyQuery.filter(x=>x.id() == targetId).neighborhood().add(window.__cyQuery.getElementById(targetId));
        selectedLayout = coseLayout;
    }
    window.__cy.elements().remove();
    setTimeout(() => {
        // don't apply filtering when viewing the full graph
        if(targetId != null) {
            var targetNode = xrData.researchData[xrData.keysIndexMap[targetId]];
            window.__cy.add(newNodes);

            // filter based on visible categories
            _.each(['dependencies', 'dependedUponBy', 'unlocks', 'unlockedBy', 'giveOneFree', 'getOneFree'], category =>
                   applyGraphFilteringCategories(window.__cy, targetNode, previousGraphFilteringCateogories, category));
        }

        var newLayout = window.__cy.layout(selectedLayout);
        newLayout.run();
        window.__cy.reset();
        self.props.dispatch(xrActions.graphUpdatingChange(false));
    }, TIMEOUT_LENGTH_MS);
};

const mapStateToProps = (state, ownProps) => {
    var dispatchProps = {props: {dispatch: __store.dispatch}};
    if(state.selectedNodeId !== previousSelectedNodeId) {
        previousSelectedNodeId = state.selectedNodeId;
        previousGraphFilteringCateogories = state.graphFilteringCategories;
        showSelectedNodeInGraph(state.selectedNodeId, dispatchProps, state.xrData);
    } else if(state.selectedNodeId !== null && JSON.stringify(previousGraphFilteringCateogories) !== JSON.stringify(state.graphFilteringCategories)) {
        // is this needlessly expensive?
        console.log("graph filtering categories have changed");
        previousSelectedNodeId = state.selectedNodeId;
        previousGraphFilteringCateogories = state.graphFilteringCategories;
        showSelectedNodeInGraph(state.selectedNodeId, dispatchProps, state.xrData);
    }
    return {
        xrData: state.xrData
    };
};

const mapDispatchToProps = (dispatch, state) => {
    return {
        onNodeSelection: (e) => {
            var targetId = e.target.id();
            previousGraphFilteringCateogories = state.graphFilteringCategories;
            if(previousSelectedNodeId !== targetId) {
                dispatch(xrActions.nodeSelection(targetId));
                dispatch(xrActions.sidebarModeChange(xrActions.SIDEBAR_MODE_NODE_DETAILS));
            } else {
                showSelectedNodeInGraph(targetId, {props: {dispatch}}, state.xrData);
            }
        },
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);
