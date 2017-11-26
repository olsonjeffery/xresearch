import { createElement as e, Component } from 'react';
import {connect} from 'react-redux';

import {Constants} from './Constants.js';
import {GraphComponent} from './GraphComponent';
import {SearchResultsListComponent} from './NodeListComponents.js';
import {LeftDetailsComponent, RightDetailsComponent} from './NodeDetailsComponent.js';
import {ErrorDisplayComponent} from './ErrorDisplayComponent.js';
import {PageNavComponent} from './PageNavComponent.js';
import {PageSplashComponent} from './PageSplashComponent.js';

class AppViewComponent extends Component {
    constructor(props) {
        super(props);
    }
    getPageNav() {
        return e(PageNavComponent, {version: this.props.version, xpiratezVersion: this.props.xpiratezVersion}, null);
    }
    getPageFooter() {
        return e('span', {style: {textAlign: 'center'}}, 'xresearch is a tool to explore and visualize research-tree info for the ',
                 e('a', {href: Constants.HREF_XPIRATEZ, target: '_blank'}, 'XPiratez'), ' game. It is not a product of, or endorsed by, the Xpiratez team. The source repository for this project is ', e('a', {href: Constants.HREF_XRESEARCH, target: '_blank'}, 'available on github'), '.');
    }
    renderMobile() {
        var leftContentRow = e('div', {className: 'row'},
                               e('div', {className:'col-12'},
                                 e(LeftDetailsComponent, {}, null)));
        var graphContentRow = e('div', {className: 'row'},
                                e('div', {className:'col-12'},
                                  this.props.selectedNodeId === null ? e(PageSplashComponent, {}, null) : e(GraphComponent, {}, null)));
        var srContentRow = e('div', {className: 'row'},
                             e('div', {className:'col-12'},
                               e(SearchResultsListComponent, {active: false, nodes: [], title: 'Search Results'}, null)));
        var rightContentRow = e('div', {className: 'row'},
                                e('div', {className:'col-12'},
                                  e(RightDetailsComponent, {}, null)));
        var pageFooterRow = e('div', {className: 'row'},
                              e ('div', {className: 'col-12'},
                                 this.getPageFooter()));
        var app = e(ErrorDisplayComponent, null, srContentRow, graphContentRow, leftContentRow, rightContentRow, pageFooterRow);
        return e('div', {}, this.getPageNav(), e('div', {style: {paddingTop:'1em', paddingRight:'15px', paddingLeft:'15px', marginRight:'auto', marginLeft:'auto'},className: 'fluid-container'}, app));
    }
    renderFull() {
        var contentRow = e('div', {className: 'row', style: {paddingBottom:'1em'}},
                           e('div', {className: 'col-md-3', style:{height: `${this.props.height-Constants.VIEWPORT_OFFSET}px`,overflowY:'scroll'}},
                             e(LeftDetailsComponent, {}, null)),
                           e('div', {className: 'col-md-6'},
                             this.props.selectedNodeId === null ? e(PageSplashComponent, {}, null) : e(GraphComponent, {}, null)),
                           e('div', {className: 'col-md-3', style:{height: `${this.props.height-Constants.VIEWPORT_OFFSET}px`,overflowY:'scroll'}},
                             e(SearchResultsListComponent, {active: false, nodes: [], title: 'Search Results'}, null),
                             e(RightDetailsComponent, {}, null)));
        var pageFooterRow = e('div', {className: 'row'},
                              e ('div', {className: 'col-md-2'}),
                              e ('div', {className: 'col-md-8'},
                                 this.getPageFooter()),
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
        selectedNodeId: state.selectedNodeId,
        height: state.viewportSize.height,
        isMobile: state.viewportSize.width < 576
    };
};
export const AppComponent = connect(mapStateToProps, () => {return {};})(AppViewComponent);
