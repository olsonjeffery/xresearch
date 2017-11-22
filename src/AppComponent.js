import { createElement as e, Component } from 'react';
import GraphComponent from './GraphComponent';
import {SearchResultsListComponent} from './NodeListComponents.js';
import {LeftDetailsComponent, RightDetailsComponent} from './NodeDetailsComponent.js';
import ErrorDisplayComponent from './ErrorDisplayComponent.js';
import PageNavComponent from './PageNavComponent.js';
import {connect} from 'react-redux';
import Constants from './Constants.js';

class AppComponent extends Component {
    constructor(props) {
        super(props);
    }
    getPageNav() {
        return e(PageNavComponent, {version: this.props.version, xpiratezVersion: this.props.xpiratezVersion}, null);
    }
    renderMobile() {
        var leftContentRow = e('div', {className: 'row'},
                               e('div', {className:'col-12'},
                                 e(LeftDetailsComponent, {}, null)));
        var graphContentRow = e('div', {className: 'row'},
                                e('div', {className:'col-12'},
                                  e(GraphComponent, {}, null)));
        var srContentRow = e('div', {className: 'row'},
                             e('div', {className:'col-12'},
                               e(SearchResultsListComponent, {active: false, nodes: [], title: 'Search Results'}, null)));
        var rightContentRow = e('div', {className: 'row'},
                                e('div', {className:'col-12'},
                                  e(RightDetailsComponent, {}, null)));
        var pageFooterRow = e('div', {className: 'row'},
                              e ('div', {className: 'col-12'},
                                 e('span', {style: {textAlign: 'center'}}, 'xresearch is a tool to explore and visualize research-tree info for the ',
                                   e('a', {href: 'https://openxcom.org/forum/index.php?topic=3626.0', target: '_blank'}, 'XPiratez'), ' game. It is not a product of, or endorsed by, the Xpiratez team. The source repository for this project is ', e('a', {href: 'https://github.com/olsonjeffery/xresearch', target: '_blank'}, 'available on github'), '.')));
        var app = e(ErrorDisplayComponent, null, srContentRow, graphContentRow, leftContentRow, rightContentRow, pageFooterRow);
        return e('div', {}, this.getPageNav(), e('div', {style: {paddingTop:'1em', paddingRight:'15px', paddingLeft:'15px', marginRight:'auto', marginLeft:'auto'},className: 'fluid-container'}, app));
    }
    renderFull() {
        var contentRow = e('div', {className: 'row', style: {paddingBottom:'1em'}},
                           e('div', {className: 'col-md-3', style:{height: `${this.props.height-Constants.VIEWPORT_OFFSET}px`,overflowY:'scroll'}},
                             e(LeftDetailsComponent, {}, null)),
                           e('div', {className: 'col-md-6'},
                             e(GraphComponent, {}, null)),
                           e('div', {className: 'col-md-3', style:{height: `${this.props.height-Constants.VIEWPORT_OFFSET}px`,overflowY:'scroll'}},
                             e(SearchResultsListComponent, {active: false, nodes: [], title: 'Search Results'}, null),
                             e(RightDetailsComponent, {}, null)));
        var pageFooterRow = e('div', {className: 'row'},
                              e ('div', {className: 'col-md-2'}),
                              e ('div', {className: 'col-md-8'},
                                 e('span', {style: {textAlign: 'center'}}, 'xresearch is a tool to explore and visualize research-tree info for the ',
                                   e('a', {href: 'https://openxcom.org/forum/index.php?topic=3626.0', target: '_blank'}, 'XPiratez'), ' game. It is not a product of, or endorsed by, the Xpiratez team. The source repository for this project is ', e('a', {href: 'https://github.com/olsonjeffery/xresearch', target: '_blank'}, 'available on github'), '.')),
                              e('div', {className: 'col-md-2'}, null));
        var app = e(ErrorDisplayComponent, null, contentRow, pageFooterRow);
        return e('div', {}, this.getPageNav(), e('div', {style: {paddingTop:'1em', paddingRight:'15px', paddingLeft:'15px', marginRight:'auto', marginLeft:'auto'},className: 'fluid-container'}, app));
    }
    render() {
        // THIS NEEDS WORK
        if(this.props.isMobile) {
            return this.renderMobile();
        } else {
            return this.renderFull();
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        height: state.viewportSize.height,
        isMobile: state.viewportSize.width < 576
    };
};
export default connect(mapStateToProps, () => {return {};})(AppComponent);
