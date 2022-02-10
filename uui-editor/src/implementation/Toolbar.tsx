import * as React from 'react';
import { Portal } from "@epam/uui-components";
import * as css from './Toolbar.scss';
import * as ReactDOM from "react-dom";
import {Editor, Plugins} from 'slate-react';
import { Popper } from 'react-popper';
import flatten from 'lodash.flatten';
import { LayoutContext, LayoutLayer, UuiContext } from "@epam/uui-core";
import { isTextSelected } from '../helpers';

interface ToolbarProps {
    editor: Editor;
    plugins: Plugins;
}

export class Toolbar extends React.Component<ToolbarProps, any> {
    static contextType = UuiContext;

    toolbar: HTMLElement | null;
    private layer: LayoutLayer = null;
    public context: { uuiLayout: LayoutContext };


    constructor(props: ToolbarProps, context: { uuiLayout: LayoutContext }) {
        super(props);
        this.layer = context.uuiLayout && context.uuiLayout.getLayer();
    }

    componentWillUnmount() {
        this.context.uuiLayout.releaseLayer(this.layer);
    }

    virtualReferenceElement() {
        const toolbar: HTMLElement = ReactDOM.findDOMNode(this.toolbar) as any;

        return {
            getBoundingClientRect: () => {
                const native = window.getSelection();
                const range = native.getRangeAt(0);
                return range.getBoundingClientRect();
            },
            clientWidth: toolbar && toolbar.getBoundingClientRect().width,
            clientHeight: toolbar && toolbar.getBoundingClientRect().height,
        };
    }

    renderButton = (Button: React.ComponentType<{ editor: Editor }>, index: number) => {
        return <Button editor={ this.props.editor } key={ `toolbar-button-${index}` } />;
    }

    render() {
        if (!this.props.editor) {
            return null;
        }

        return (
            <Portal>
                { isTextSelected(this.props.editor) && <Popper referenceElement={ this.virtualReferenceElement() } placement='top' modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }>
                    { (props) => {
                        return (
                            <div ref={ (node) => { this.toolbar = node; (props.ref as React.RefCallback<any>)(node); } } onMouseDown={ (e: any) => e.preventDefault() } className={ css.container }  style={ { ...props.style, zIndex: this.layer.zIndex } } >
                                { flatten(this.props.plugins).map((plugin: any) => plugin.toolbarButtons && plugin.toolbarButtons.map((button: any, index: number) => this.renderButton(button, index))) }
                            </div>
                        );
                    } }
                </Popper> }
            </Portal>
        );
    }
}