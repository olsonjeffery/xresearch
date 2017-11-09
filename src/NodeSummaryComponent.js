import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {xrActions} from './SharedSetup.js';
import {researchById} from './XrDataQueries.js';

class NodeSummaryComponent extends Component {
    render() {
        var graphUpdatingMessage = this.props.graphUpdating ?
            e('span', {style: {float: 'left', margin: '22px'}},
              e('i', {className: 'fa fa-refresh fa-spin fa-2x fa-fw'}, null),
              e('span', {className:'sr-only'}, 'Graph Updating...'))
            : '';
        return e('div', {className: 'row'},
                 e('div', {className: 'col-2'}, graphUpdatingMessage),
                 e('div', {className: 'col-8'}, e('h3', { style: {textAlign: 'center'}}, `${this.props.label} ${this.props.suffix}`)),
                 e('div', {className: 'col-2'}, this.props.showClearSelected === false ?
                   null
                   : e('a', {onClick: this.props.onShowAllTopics, style: {margin: '22px', float: 'right'}, href:'#'}, `Show All Topics`, e('i', { className: 'fa fa-times'}, null))));
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
        if(topic == undefined) {
            suffix = '';
        } else {
            suffix = `(Base Research Cost: ${ topic.cost } Points: ${ topic.points })`;
        }
    }
    return {
        label,
        suffix,
        graphUpdating: state.graphUpdating,
        showClearSelected: label !== ALL_TOPICS
    };
};

const mapDispatchToProps = (dispatch, state) => {
    return {
        onShowAllTopics: () => {
            dispatch(xrActions.nodeSelection(null));
            dispatch(xrActions.sidebarModeChange(xrActions.SIDEBAR_MODE_SPLASH));
            dispatch(xrActions.resetGraphFilteringCategories());
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NodeSummaryComponent);
