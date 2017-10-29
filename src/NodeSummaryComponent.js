import {Component, createElement as e} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {xrActions} from './SharedSetup.js';
import {getLabelFromXrData} from './NodeListComponents.js';

class NodeSummaryComponent extends Component {
    render() {
        return e('div', {className: 'row'},
                 e('div', {className: 'col-2'}, e('span', {style: {float: 'left', margin: '22px'}}, this.props.graphUpdatingMessage)), // spinner goes here
                 e('div', {className: 'col-8'}, e('h3', { style: {textAlign: 'center'}}, `${this.props.label} ${this.props.suffix}`)),
                 e('div', {className: 'col-2'}, this.props.showClearSelected === false ?
                   null
                   : e('a', {onClick: this.props.onShowAllTopics, style: {margin: '22px', float: 'right'}, href:'#'}, `Show All Topics`, e('i', { className: 'fa fa-times'}, null))));
    }
}

const ALL_TOPICS = 'All Topics';
const mapStateToProps = (state) => {
    var label = state.selectedNodeId != null ?
        getLabelFromXrData(state.xrData, state.selectedNodeId)
        : ALL_TOPICS;
    var suffix = '';
    if(state.selectedNodeId != null) {
        var topic = state.xrData.researchData[state.xrData.keysIndexMap[state.selectedNodeId]];
        suffix = `(Base Research Cost: ${ topic.cost } Points: ${ topic.points })`;
    }
    var graphUpdatingMessage = state.graphUpdating ?
        'Graph Updating...'
        : '';
    return {
        xrData: state.xrData,
        label,
        suffix,
        graphUpdatingMessage,
        showClearSelected: label !== ALL_TOPICS
    };
};

const mapDispatchToProps = (dispatch, state) => {
    return {
        onShowAllTopics: () => {
            dispatch(xrActions.nodeSelection(null));
            dispatch(xrActions.sidebarModeChange(xrActions.SIDEBAR_MODE_SPLASH));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NodeSummaryComponent);
