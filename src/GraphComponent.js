import {Component, createElement as e} from 'react';
import cytoscape from 'cytoscape';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _ from 'lodash';

import {Constants} from './Constants.js';
import {researchById, allResearchData, isTopicInGraphNodes} from './XrDataQueries.js';
import {nodeSelection, graphUpdatingChange} from './StateManagement.js';

var dupeTopics = [];
const TIMEOUT_LENGTH_MS = 100;
var buildElementsFromAllResearchData = () => {
    var addedTopics = {};
    dupeTopics = [];
    var elements = [];
    var researchData = allResearchData();
    _.each(researchData, function(topic, idx) {
        if(addedTopics[topic.id]) {
            dupeTopics.push(topic.id);
            // we have to bail because this is a repeat
            return true;
        }
        addedTopics[topic.id] = true;

        if(topic.id === 'STR_NIGHTMARE') {
            console.log('nightmare');
        }
        // add node here
        elements.push({
            data: {
                id: topic.id,
                name: topic.label == undefined ? topic.id : topic.label,
                weight: idx
            },
            classes: topic.topicKind
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
                addEdge(dep, topic.id, 'dependencies', idx);
            });
        }
        if(topic.unlocks) {
            _.each(topic.unlocks, function(dep) {
                addEdge(dep, topic.id, 'unlocks', idx);
            });
        }
        if(topic.requiresBuy) {
            _.each(topic.requiresBuy, function(dep) {
                // these are events mostly
                addEdge(dep, topic.id, 'requires', idx);
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
        if(topic.requiredItems) {
            _.each(topic.requiredItems, x => {
                addEdge(x.id, topic.id, 'manufacture', idx);
            });
        }
        if(topic.requiredToConstruct) {
            _.each(topic.requiredToConstruct, x => {
                addEdge(x, topic.id, 'manufacture', idx);
            });
        }
    });
    return elements;
};

var cyStyle = [
    // edge styles
    {"selector": ".dependencies",
     "style": {
         "width": "1px",
         "line-color": Constants.COLOR_GREEN,
         "mid-target-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-target-arrow-shape": "triangle",
         "mid-target-arrow-color": Constants.COLOR_GREEN
     }},
    {"selector": ".unlocks",
     "style": {
         "width": "1px",
         "line-color": Constants.COLOR_BLUE,
         "mid-source-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-source-arrow-shape": "triangle",
         "mid-source-arrow-color": Constants.COLOR_BLUE
     }},
    {"selector": ".getOneFree",
     "style": {
         "width": "1px",
         "line-color": Constants.COLOR_RED,
         "mid-source-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-source-arrow-shape": "triangle",
         "mid-source-arrow-color": Constants.COLOR_RED
     }},
    {"selector": ".manufacture",
     "style": {
         "width": "1px",
         "line-color": Constants.COLOR_ORANGE,
         "mid-target-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-target-arrow-shape": "triangle",
         "mid-target-arrow-color": Constants.COLOR_ORANGE
     }},
    {"selector": ".requires",
     "style": {
         "width": "1px",
         "line-color": Constants.COLOR_GRAY_LIGHT,
         "mid-target-arrow-fill": 'filled',
         "arrow-scale": 1,
         "mid-target-arrow-shape": "triangle",
         "mid-target-arrow-color": Constants.COLOR_GRAY_LIGHT
     }},
    // node styles
    {"selector": "node.facility",
     "style": {
         "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "content": "data(name)",
         "font-size": "9px",
         "text-valign": "center",
         "text-halign": "center",
         "background-color": Constants.COLOR_RED,
         "text-outline-color": '#000',
         "text-outline-width": "1px",
         "color": "#fff",
         "overlay-padding": "6px",
         "z-index": "10",
         shape: "barrel"
     }},
    {"selector": "node.idea",
     "style": {
         "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "content": "data(name)",
         "font-size": "9px",
         "text-valign": "center",
         "text-halign": "center",
         "background-color": Constants.COLOR_BLUE,
         "text-outline-color": '#000',
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
         "background-color": Constants.COLOR_GREEN,
         "text-outline-color": '#000',
         "text-outline-width": "1px",
         "color": "#fff",
         "overlay-padding": "6px",
         "z-index": "10",
         shape: "ellipse"
     }},
    {"selector": "node.manufacture",
     "style": {
         "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
         "content": "data(name)",
         "font-size": "9px",
         "text-valign": "center",
         "text-halign": "center",
         "background-color": Constants.COLOR_ORANGE,
         "text-outline-color": '#000',
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
         "background-color": Constants.COLOR_GRAY_LIGHT,
         "text-outline-color": "#000",
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

const initCyQueryCollection = () => {
    window.__cyQuery = cytoscape({
        headless: true,
        elements: buildElementsFromAllResearchData(),
        layout: concentricTotalLayout,
        style: cyStyle
    });
};

class GraphViewComponent extends Component {
    constructor(props) {
        super(props);
        this.containerId = 'cy-container';
    }

    componentDidMount() {
        var self = this;
        this.props.dispatch(graphUpdatingChange(true));
        setTimeout(() => {
            if(window.__cyQuery == undefined) {
                initCyQueryCollection();
            }
            setTimeout(() => {
                let cy = cytoscape({
                    container: document.getElementById(Constants.CY_CONTAINER_ID),
                    elements: [],
                    layout: null,
                    style: cyStyle
                });
                window.__cy = cy;
                cy.on('tap', 'node', (e) => {
                    self.props.onNodeSelection(e);
                });
                showSelectedNodeInGraph(self.props.selectedNodeId, self, {graphFilteringCategories: self.props.graphFilteringCategories});
            }, TIMEOUT_LENGTH_MS);
        }, TIMEOUT_LENGTH_MS);
    }

    render() {
        return e('div', {style:{backgroundColor: Constants.COLOR_GRAY_DARK}, className: 'xr-shadow'},
                 e('div', {id: this.containerId, style:{width: '100%',height: `${this.props.viewportHeight - Constants.VIEWPORT_OFFSET}px`}}, null));
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
const showSelectedNodeInGraph = (targetId, self, state) => {
    if(window.__cy === undefined) {
        // we bail if __cy isn't defined yet; defer it to componentDidMount
        return;
    }
    var newNodes = [];
    var selectedLayout = {};
    self.props.dispatch(graphUpdatingChange(true));
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
        window.__cy.add(newNodes);
        if(targetId != null) {
            var filterableCategories = Reflect.ownKeys(state.graphFilteringCategories);
            var targetNode = researchById(targetId);

            // filter based on visible categories
            _.each(filterableCategories, category =>
                   applyGraphFilteringCategories(window.__cy, targetNode, previousGraphFilteringCateogories, category));
        }

        var newLayout = window.__cy.layout(selectedLayout);
        newLayout.run();
        window.__cy.reset();
        self.props.dispatch(graphUpdatingChange(false));
    }, TIMEOUT_LENGTH_MS);
};

const mapStateToProps = (state, ownProps) => {
    var dispatchProps = {props: {dispatch: __store.dispatch}};
    if(state.selectedNodeId !== previousSelectedNodeId) {
        previousSelectedNodeId = state.selectedNodeId;
        previousGraphFilteringCateogories = state.graphFilteringCategories;
        showSelectedNodeInGraph(state.selectedNodeId, dispatchProps, state);
    } else if(state.selectedNodeId !== null && JSON.stringify(previousGraphFilteringCateogories) !== JSON.stringify(state.graphFilteringCategories)) {
        previousSelectedNodeId = state.selectedNodeId;
        previousGraphFilteringCateogories = state.graphFilteringCategories;
        showSelectedNodeInGraph(state.selectedNodeId, dispatchProps, state);
    }
    return {graphFilteringCategories: state.graphFilteringCategories, selectedNodeId: state.selectedNodeId, viewportHeight: state.viewportSize.height};
};

const mapDispatchToProps = (dispatch, state) => {
    return {
        onNodeSelection: (e) => {
            var targetId = e.target.id();
            if(!isTopicInGraphNodes(targetId)) return;
            previousGraphFilteringCateogories = state.graphFilteringCategories;
            if(previousSelectedNodeId !== targetId) {
                dispatch(nodeSelection(targetId));
            } else {
                showSelectedNodeInGraph(targetId, {props: {dispatch}}, state);
            }
        },
        dispatch
    };
};

export const GraphComponent = connect(mapStateToProps, mapDispatchToProps)(GraphViewComponent);
