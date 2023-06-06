import * as React from 'react';
import flatten from 'lodash.flatten';
import { Popper } from 'react-popper';
import { Editor, Plugins } from 'slate-react';
import { LayoutContext, LayoutLayer, UuiContext } from '@epam/uui-core';
import { Portal } from '@epam/uui-components';
import { isTextSelected } from '../helpers';
import css from './Toolbar.module.scss';

interface ToolbarProps {
    editor: Editor;
    plugins: Plugins;
}

export class Toolbar extends React.Component<ToolbarProps> {
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
        return {
            clientWidth: this.toolbar?.getBoundingClientRect().width,
            clientHeight: this.toolbar?.getBoundingClientRect().height,
            getBoundingClientRect() {
                const native = window.getSelection();
                const range = native.getRangeAt(0);
                return range.getBoundingClientRect();
            },
        };
    }

    renderButton = (Button: React.ComponentType<{ editor: Editor }>, index: number) => {
        return <Button editor={ this.props.editor } key={ `toolbar-button-${index}` } />;
    }

    render() {
        if (!this.props.editor) return null;

        return (
            <Portal>
                { isTextSelected(this.props.editor) && (
                    <Popper
                        referenceElement={ this.virtualReferenceElement() }
                        placement='top'
                        modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }
                    >
                        { props => (
                            <div
                                onMouseDown={ e => e.preventDefault() }
                                className={ css.container }
                                style={ { ...props.style, zIndex: this.layer.zIndex } }
                                ref={ node => {
                                    this.toolbar = node;
                                    (props.ref as React.RefCallback<HTMLDivElement>)(node);
                                } }
                            >
                                { flatten(this.props.plugins).map((plugin: any) => plugin.toolbarButtons
                                    && plugin.toolbarButtons.map((button: any, index: number) => this.renderButton(button, index))) }
                            </div>
                        ) }
                    </Popper>
                ) }
            </Portal>
        );
    }
}
