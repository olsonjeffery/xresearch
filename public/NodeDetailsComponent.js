(() => {
    const e = React.createElement;

    class NodeDetailsPresentationComponent extends React.Component {
        render() {
            if(this.props.active) {
                return e('div', {},
                         e('h3', {}, `${this.props.name} (${this.props.id})`),
                         e(xrComponents.DependenciesResultsListComponent, {title: 'Dependencies', store: this.props.store}, null));
            }
            return null;
        }
    }

    NodeDetailsPresentationComponent.propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    };

    const mapStateToProps = (state) => {
        var active = state.sidebarMode == xrActions.SIDEBAR_MODE_NODE_DETAILS;
        // map dependencies
        return {
            id: state.selectedNodeId,
            name: state.selectedNodeId == null ? '' : state.xrData.researchData[state.xrData.keysIndexMap[state.selectedNodeId]].label,
            active
        };
    };

    const mapDispatchToProps = (dispatch, ownProps) => {
        return {};
    };

    xrComponents.NodeDetailsComponent = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(NodeDetailsPresentationComponent);
})();
