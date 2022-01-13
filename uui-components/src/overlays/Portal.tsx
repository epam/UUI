import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface PortalProps {
    target?: HTMLElement;
    key?: string;
}

interface PortalState {
    el: HTMLElement;
    root: HTMLElement;
}

export class Portal extends React.Component<PortalProps, PortalState> {
    constructor(props: PortalProps) {
        super(props);

        this.state = {
            el: null,
            root: this.props.target,
        };
    }

    componentDidMount() {
        const el = document.createElement('div');
        // This fixes dropdown and tooltip glitch - dropdown jumps right a bit on open.
        // We don't know why is fixes the issue, but it works :)
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100%';

        const rootElement = this.props.target || document.getElementById('main') || document.getElementById('root') || document.body;
        rootElement.appendChild(el);
        this.setState({
            el: el,
            root: rootElement,
        });
    }

    componentWillUnmount() {
        this.state.root.removeChild(this.state.el);
    }

    render() {
        if (!this.state.el || !this.state.root) return null;

        return ReactDOM.createPortal(this.props.children, this.state.el, this.props.key);
    }
}
