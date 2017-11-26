import {connect} from 'react-redux';
import {createElement as e, Component} from 'react';
import {Constants} from './Constants.js';

class PageSplashViewComponent extends Component {
    constructor(props) {
        super(props);
    }

    buildCopy() {
        return e('ul', {},
                 e('li', {}, 'Use the search bar to look up topics by name'),
                 e('li', {}, 'When viewing research topics, clicking the "xresearch" title at the top-left will reset the application to its initial state (displaying this splash page)'),
                 e('li', {}, 'You can also ',e('a', {href:Constants.HREF_XRESEARCH, target: '_blank'}, 'visit the Github Repository'), ' for xresearch or ', e('a', {href: Constants.HREF_XPIRATEZ, target: '_blank'}, 'check out the XPiratez page'))
                );
    }

    render() {
        if(this.props.active) {
            return e('div', {className: 'xr-shadow', style: {backgroundColor: Constants.COLOR_GRAY_DARK, overflowY: 'scroll', width: '100%', height: this.props.heightPx}},
                     e('div', {className: 'container', style: {paddingTop:'2em'}},
                       e('div', {className: 'row'},
                         e('div', {className: 'col-12', style:{textAlign:'center'}},
                           e('i', {className: 'fa fa-info-circle fa-5x fa-fw'}, null))),
                       e('div', {className: 'row'},
                         e('div', {className: 'col-12', style:{textAlign:'center'}},
                           e('h3', {}, 'Welcome to xresearch!'))),
                       e('div', {className: 'row', style:{paddingTop:'2em'}},
                         e('div', {className: 'col-12', style:{}},
                           this.buildCopy()))));
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        heightPx: `${state.viewportSize.height - Constants.VIEWPORT_OFFSET}px`,
        active: state.selectedNodeId === null
    };
};

const mapDispatchToProps = (state, ownProps) => {
    return {
    };
};

export const PageSplashComponent = connect(mapStateToProps, mapDispatchToProps)(PageSplashViewComponent);
