import React, { useRef } from 'react';
import flatten from 'lodash.flatten';
import { Popper } from 'react-popper';
import { ReactEditor as Editor, useSlate, useFocused } from 'slate-react';
import { LayoutContext, LayoutLayer, UuiContext } from '@epam/uui-core';
import { Portal } from '@epam/uui-components';
import { isTextSelected } from '../helpers';
import * as css from './Toolbar.scss';

interface ToolbarProps {
    editor: Editor;
    plugins: any;
}

export function Toolbar(props: ToolbarProps): any {
    const ref = useRef<HTMLElement | null>();
    const editor = useSlate();
    const inFocus = useFocused();

    const virtualReferenceElement = () => {
        return {
            clientWidth: ref?.current?.getBoundingClientRect().width,
            clientHeight: ref?.current?.getBoundingClientRect().height,
            getBoundingClientRect() {
                const native = window.getSelection();
                const range = native?.getRangeAt(0);
                return range?.getBoundingClientRect();
            },
        };
    };

    const renderButton = (Button: React.ComponentType<{ editor: any }>, index: number) => {
        return <Button editor={ editor } key={ `toolbar-button-${index}` } />;
    };

    return (
        <Portal>
            { isTextSelected(editor, inFocus) && (
                <Popper
                    referenceElement={ virtualReferenceElement() }
                    placement='top'
                    modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }
                >
                    { popperProps => (
                        <div
                            onMouseDown={ e => e.preventDefault() }
                            className={ css.container }
                            style={ { ...popperProps.style } }
                            ref={ node => {
                                ref.current = node;
                                (popperProps.ref as React.RefCallback<HTMLDivElement>)(node);
                            } }
                        >
                            { flatten(props.plugins).map((plugin: any) => plugin.toolbarButtons
                                && plugin.toolbarButtons.map((button: any, index: number) => renderButton(button, index))) }
                        </div>
                    ) }
                </Popper>
            ) }
        </Portal>
    );
}

// export class Toolbar1 extends React.Component<ToolbarProps> {
//     static contextType = UuiContext;
//
//     toolbar: HTMLElement | null;
//     private layer: LayoutLayer = null;
//     public context: { uuiLayout: LayoutContext };
//
//     constructor(props: ToolbarProps, context: { uuiLayout: LayoutContext }) {
//         super(props);
//         this.layer = context.uuiLayout && context.uuiLayout.getLayer();
//     }
//
//     componentWillUnmount() {
//         this.context.uuiLayout.releaseLayer(this.layer);
//     }
//
//     virtualReferenceElement() {
//         return {
//             clientWidth: this.toolbar?.getBoundingClientRect().width,
//             clientHeight: this.toolbar?.getBoundingClientRect().height,
//             getBoundingClientRect() {
//                 const native = window.getSelection();
//                 const range = native?.getRangeAt(0);
//                 return range?.getBoundingClientRect();
//             },
//         };
//     }
//
//     renderButton = (Button: React.ComponentType<{ editor: Editor }>, index: number) => {
//         return <Button editor={ this.props.editor } key={ `toolbar-button-${index}` } />;
//     }
//
//     render() {
//         if (!this.props.editor) return null;
//
//         return (
//             <Portal>
//                 { isTextSelected(this.props.editor) && (
//                     <Popper
//                         referenceElement={ this.virtualReferenceElement() }
//                         placement='top'
//                         modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }
//                     >
//                         { props => (
//                             <div
//                                 onMouseDown={ e => e.preventDefault() }
//                                 className={ css.container }
//                                 style={ { ...props.style, zIndex: this.layer.zIndex } }
//                                 ref={ node => {
//                                     this.toolbar = node;
//                                     (props.ref as React.RefCallback<HTMLDivElement>)(node);
//                                 } }
//                             >
//                                 { flatten(this.props.plugins).map((plugin: any) => plugin.toolbarButtons
//                                     && plugin.toolbarButtons.map((button: any, index: number) => this.renderButton(button, index))) }
//                             </div>
//                         ) }
//                     </Popper>
//                 ) }
//             </Portal>
//         );
//     }
// }