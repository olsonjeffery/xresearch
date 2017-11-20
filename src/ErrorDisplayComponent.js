import { createElement as e, Component } from 'react';

class ErrorDisplayComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error, info) {
        this.setState({ hasError: true, componentStack: info.componentStack});
    }
    render() {
        if(this.state.hasError) {
            return e('div', {className: 'container'},
                     e('div', {className: 'row', style: {paddingTop: '15px'}},
                       e('div', {className: 'col-xs-12'}, ' ')
                      ),
                     e('div', {className: 'row', style: {paddingTop: '15px'}},
                       e('div', {className: 'col-xs-2'}, ' '),
                       e('div', {className: 'col-xs-8'},
                         e('div', {style:{padding: '10px', border: '2px dashed #F0386B', color: '#F0386B', textAlign: 'center'}}, e('i', {className: 'fa fa-exclamation-triangle fa-5x', style:{color: '#f0386b'}}, null), e('br'), 'There was an error in xresearch. Component stack trace:', e('br'), e('br'), e('div', {style: {textAlign: 'left'}}, this.state.componentStack))),
                       e('div', {className: 'col-xs-2'}, ' ')
                      )
                    );
        }
        return this.props.children;
    }
}

export default ErrorDisplayComponent;
