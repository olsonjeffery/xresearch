(() => {
    const e = React.createElement;

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

    var concentricTotalLayout = {
        name: 'concentric',
        concentric: function( ele ){ return ele.data('weight'); },
        levelWidth: function( nodes ){ return nodes.length / 80; },
        padding: 10,
        fit: false,
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true
    };

    class GraphComponent extends React.Component {
        constructor(props) {
            super(props);
            this.data = props.data;
            this.containerId = 'cy-container';
        }

        componentDidMount() {
            setTimeout(() => {
                this.cy = cytoscape({
                    container: document.getElementById(this.containerId),
                    elements: buildElements(this.data),

                    /*
                      layout: {
                      name: 'cose',
                      fit: false,
                      nodeDimensionsIncludeLabels: true,
                      },
                    */
                    layout: concentricTotalLayout,
                    /*
                      layout: {
                      name: 'grid',
                      avoidOverlap: true,
                      avoidOverlapPadding: 100,
                      padding: 500,
                      fit: false,
                      //nodeDimensionsIncludeLabels: true
                      },
                    */
                    style: [
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
                    ]
                });
            }, 10);
        }

        render() {
            return e('div', {id: this.containerId}, null);
        }
    }

    xrComponents.GraphComponent = GraphComponent;
})();
