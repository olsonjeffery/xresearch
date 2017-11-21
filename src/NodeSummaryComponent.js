import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {nodeSelection} from './StateManagement.js';
import {researchById} from './XrDataQueries.js';

class NodeSummaryComponent extends Component {
    render() {
        var graphUpdatingMessage = this.props.graphUpdating ?
            e('span', {style: {float: 'left', margin: '22px'}},
              e('i', {className: 'fa fa-refresh fa-spin fa-2x fa-fw'}, null),
              e('span', {className:'sr-only'}, 'Graph Updating...'))
            : '';
        var label = this.props.targetId === null || this.props.label === this.props.targetId ? this.props.label
            : `${this.props.label} (${this.props.targetId})`;
        return null;
        /*
        return e('div', {className: 'row'},
                 e('div', {className: 'col-xs-2'}, graphUpdatingMessage),
                 e('div', {className: 'col-xs-8'}, e('h3', { style: {textAlign: 'center'}}, `${label} ${this.props.suffix}`)),
                 e('div', {className: 'col-xs-2'}, this.props.showClearSelected === false ?
                   null
                   : null));
                   */
    }
}
const ALL_TOPICS = 'All Topics';
const mapStateToProps = (state) => {
    var targetNode = researchById(state.selectedNodeId);
    var label = state.selectedNodeId != null ?
        targetNode.label
        : ALL_TOPICS;
    var suffix = '';
    if(state.selectedNodeId != null) {
        var topic = researchById(state.selectedNodeId);
        var costResearch = topic.costResearch ? ` Research (Base): ${ topic.costResearch }pts.` : '';
        var costManufacture = topic.costManufacture ? ` Manufacture: $${ topic.costManufacture }` : '';
        var costBuy = topic.costBuy ? ` Buy: $${ topic.costBuy }` : '';
        var costSell = topic.costSell ? ` Sell: $${ topic.costSell }` : '';
        var costBuild = topic.costBuild ? ` Build: $${topic.costBuild}` : '';
        var pointsAwarded = topic.points ? ` Points: ${ topic.points }` : '';
        var manufactureTime = topic.timeTotalManufacture ? ` Manufacture Time: ${parseBuildTime(topic.timeTotalManufacture)}` : ``;
        var buildTime = topic.timeBuild ? ` Build Time: ${parseBuildTime(topic.timeBuild)}` : '';
        if(topic == undefined) {
            suffix = '';
        } else {
            let allCosts = `(Cost:${costResearch}${costManufacture}${costBuy}${costSell}${pointsAwarded}${costBuild})`;
            allCosts = allCosts === '(Cost:)' ? '' : allCosts;
            suffix = `${allCosts}${buildTime}${manufactureTime}`;
        }
    }
    return {
        targetId: state.selectedNodeId,
        label,
        suffix,
        graphUpdating: state.graphUpdating,
        showClearSelected: label !== ALL_TOPICS
    };
};

const mapDispatchToProps = (dispatch, state) => {
    return {
        onShowAllTopics: () => {
            dispatch(nodeSelection(null));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NodeSummaryComponent);
