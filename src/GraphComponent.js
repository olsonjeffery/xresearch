import {Component, createElement as e} from 'react';
import cytoscape from 'cytoscape';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import xrActions from './SharedSetup';

var dupeTopics = [];
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
                name: topic.label,
                weight: idx
            },
            classes: topic.needItem ? 'idea' : 'item'
        });
        return true;
    });

    // a second traversal to add edges; we can't do this until we
    // know what all of the topics are
    _.each(researchData, function(topic) {
        if(topic.dependencies) {
            _.each(topic.dependencies, function(dep) {
                if(addedTopics[topic.id] && addedTopics[dep]) {
                    elements.push({
                        data: {
                            id: dep+"->"+topic.id,
                            target: topic.id,
                            source: dep
                        },
                        classes: 'dep'
                    });
                }
            });
        }
        if(topic.unlocks) {
            _.each(topic.unlocks, function(dep) {
                if(addedTopics[topic.id] && addedTopics[dep]) {
                    elements.push({
                        data: {
                            id: dep+"->"+topic.id,
                            target: topic.id,
                            source: dep
                        },
                        classes: 'unlocks'
                    });
                }
            });
        }
        if(topic.requires) {
            _.each(topic.requires, function(dep) {
                // these are events mostly
                if(!addedTopics[dep]) {
                    elements.push({
                        data: {
                            id: dep,
                            name: dep,
                            weight: idx
                        },
                        classes: event
                    });
                }
                elements.push({
                    data: {
                        id: dep+"->"+topic.id,
                        target: topic.id,
                        source: dep
                    },
                    classes: 'requires'
                });
            });
        }
        if(topic.getOneFree) {
            _.each(topic.getOneFree, function(dep) {
                if(addedTopics[topic.id] && addedTopics[dep]) {
                    elements.push({
                        data: {
                            id: dep+"->"+topic.id,
                            target: topic.id,
                            source: dep
                        },
                        classes: 'getOneFree'
                    });
                }
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
         "target-arrow-shape": "triangle",
         "target-arrow-color": "#1a1"
     }},
    {"selector": ".unlocks",
     "style": {
         "width": "1px",
         "line-color": "#11a",
         "target-arrow-shape": "triangle",
         "target-arrow-color": "#11a"
     }},
    {"selector": ".requires",
     "style": {
         "width": "1px",
         "line-color": "#aaa",
         "target-arrow-shape": "triangle",
         "target-arrow-color": "#aaa"
     }},
    {"selector": ".getOneFree",
     "style": {
         "width": "1px",
         "line-color": "#a11",
         "target-arrow-shape": "triangle",
         "target-arrow-color": "#a11"
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
         "background-color": "gray",
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
        this.queryContainerId = 'cy-query-container';
        this.containerId = 'cy-container';
    }

    componentDidMount() {
        var self = this;
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
                self.cy.on('tap', 'node', (e) => {
                    self.props.onNodeSelection(e);
                });
            }, 10);
            window.__cyQuery = self.cyQuery;
        }, 10);
    }

    render() {
        return e('div', {},
                 e('div', {id: this.queryContainerId, style: {display: "none"}}, null),
                 e('div', {id: this.containerId}, null));
    }
}

var previousSelectedNodeId = null;
const showSelectedNodeInGraph = (targetId) => {
    var newNodes = window.__cyQuery.filter(x=>x.id() == targetId).neighborhood().add(window.__cyQuery.getElementById(targetId));
    window.__cy.elements().remove();
    window.__cy.add(newNodes);
    var newLayout = window.__cy.layout(coseLayout);
    newLayout.run();
};

const mapStateToProps = (state) => {
    if(state.selectedNodeId !== previousSelectedNodeId) {
        previousSelectedNodeId = state.selectedNodeId;
        showSelectedNodeInGraph(state.selectedNodeId);
    }
    return {
        xrData: state.xrData
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onNodeSelection: (e) => {
            var targetId = e.target.id();
            if(previousSelectedNodeId !== targetId) {
                dispatch(xrActions.nodeSelection(targetId));
                dispatch(xrActions.sidebarModeChange(xrActions.SIDEBAR_MODE_NODE_DETAILS));
            } else {
                showSelectedNodeInGraph(targetId);
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);
