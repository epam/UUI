import { EditorState, RichUtils, Modifier } from 'draft-js';
import { colorStyle } from '../../../utils/helpers';
import { Dropdown, Button } from '@epam/loveship';
import { UuiContext, UuiContexts } from '@epam/uui-core';
import * as React from 'react';
import { DraftButtonProps, ToolbarTextColor } from '../../../types';
import css from './ColorButton.module.scss';

interface ColorButtonProps extends DraftButtonProps {
    textColors: ToolbarTextColor[];
}

export class ColorButton extends React.Component<ColorButtonProps, any> {

    state = {
        color: this.props.textColors[0],
    };

    static contextType = UuiContext;
    context: UuiContexts;

    onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    toggleColor(toggledColor: string) {
        const editorState = this.props.value;
        const selection = editorState.getSelection();

        const nextContentState = this.props.textColors
        .reduce((contentState, color) => Modifier.removeInlineStyle(contentState, selection, color), editorState.getCurrentContent());

        let nextEditorState = EditorState.push(
            editorState,
            nextContentState,
            'change-inline-style',
        );

        const currentStyle = editorState.getCurrentInlineStyle();
        const hasToggledColor = currentStyle.has(toggledColor);

        if (selection.isCollapsed()) {
            nextEditorState = currentStyle.reduce((state, color) => RichUtils.toggleInlineStyle(state, color), nextEditorState);
        }

        if (!hasToggledColor) {
            nextEditorState = RichUtils.toggleInlineStyle(
                nextEditorState,
                toggledColor,
            );
        }

        this.props.onValueChange(nextEditorState);
        this.setState({ color: toggledColor });
    }

    render() {

        return (
            <div
                onMouseDown={ this.onMouseDown }
            >
                <div
                    className={ css.colorPicker }
                    onClick={ () => this.toggleColor(this.state.color) }
                >
                    <div className={ css.textColor }> A </div>
                    <div
                        className={ css.colorLine }
                        style={ { background: colorStyle[this.state.color] } }
                    />
                    <Dropdown
                        renderTarget={ (props) => (
                            <Button
                                { ...props }
                                isDropdown
                                cx={ css.button }
                                size='30'
                                fill={ 'white' }
                            />
                        ) }
                        renderBody={ (props) => (
                            <div className={ css.colors }>
                                {
                                    this.props.textColors.map(style => {
                                        return <div
                                            key={ style }
                                            className={ css.colorButton }
                                            style={ { background: colorStyle[style] } }
                                            onClick={ (e) => {
                                                this.toggleColor(style);
                                                e.stopPropagation();
                                                props.onClose();
                                            } }
                                        />;
                                    })
                                }
                            </div>
                        ) }
                        placement={ "bottom-end" }
                    />
                </div>
            </div>
        );
    }
}
