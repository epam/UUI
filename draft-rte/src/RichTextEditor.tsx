import { CompositeDecorator, Editor, EditorState, RichUtils, DraftHandleValue, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw } from 'draft-js';
import * as React from 'react';
import { IEditable, IHasCX, uuiMarkers, uuiElement, ICanBeReadonly } from '@epam/uui-core';
import { Toolbar } from './common';
import { linkDecorator } from './decorators';
import css from './RichTextEditor.module.scss';
import { convertHtmlToDraftState, convertDraftStateToHtml } from './utils';
import { ToolbarButton } from './types';
import * as I from 'immutable';
import cx from 'classnames';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { JSX } from 'react'

export type RichTextEditorBindingProps = (RawRichTextEditorProps | HtmlRichTextEditorProps | MarkdownRichTextEditorProps);
export type HtmlRichTextEditorProps = { valueType: 'html' } & IEditable<string>;
export type MarkdownRichTextEditorProps = { valueType: 'markdown' } & IEditable<string>;
export type RawRichTextEditorProps = { valueType: 'raw' } & IEditable<EditorState>;

export type RichTextEditorProps = {
    structure?: ToolbarButton[];
    // textColors?: ToolbarTextColor[];
    customClass?: string;
    placeholder?: string;
} & IHasCX & ICanBeReadonly & RichTextEditorBindingProps;

const blockRenderMap = I.Map({
    'paragraph': {
        element: 'p',
    },
    'unstyled': {
        element: 'p',
    },
});
const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap as any);

export class RichTextEditor extends React.Component<RichTextEditorProps> {

    public editor: Editor;
    private currentValue = this.props.value;
    private editorState: EditorState = this.getStateFromProps(this.props);

    getStateFromProps(props: RichTextEditorProps) {
        switch (props.valueType) {
            case "html": {
                return convertHtmlToDraftState(props.value || '') ? this.createWithContent(props.value) : this.createEmpty();
            }
            case "markdown": {
                return EditorState.createWithContent(convertFromRaw(markdownToDraft(props.value)), new CompositeDecorator([linkDecorator]));
            }
            case "raw": {
                return props.value ? props.value : this.createEmpty();
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<RichTextEditorProps>, prevState: Readonly<{}>, snapshot?: any) {
        if (this.currentValue !== this.props.value) {
            this.currentValue = this.props.value;
            this.editorState = this.getStateFromProps(this.props);
            this.forceUpdate();
        }
    }

    handleChange = (editorState: EditorState) => {
        let newValue;
        this.editorState = editorState;
        switch (this.props.valueType) {
            case "html": {
                newValue = convertDraftStateToHtml(editorState.getCurrentContent());
                break;
            }
            case "markdown": {
                newValue = draftToMarkdown(convertToRaw(editorState.getCurrentContent()), {preserveNewlines: true});
                break;
            }
            case "raw": {
                newValue = editorState;
                break;
            }
        }

        if (newValue !== this.currentValue) {
            this.currentValue = newValue;
            this.props.onValueChange(newValue as any);
        } else {
            this.forceUpdate();
        }
    }

    handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.handleChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    createWithContent(value: string): EditorState {
        return EditorState.createWithContent(convertHtmlToDraftState(value || ''), new CompositeDecorator([linkDecorator]));
    }

    createEmpty(): EditorState {
        return EditorState.createEmpty(new CompositeDecorator([linkDecorator]));
    }

    // componentDidMount() {
    //     this.focus();
    // }

    focus = () => {
        this.editor.focus();
    }

    // getColorStyleMap(colors: ToolbarTextColor[]) {
    //     let colorStyleMap: { [key: string]: { color: string} } = {};
    //     colors.map(color => {
    //         colorStyleMap[color] = {
    //             color: colorStyle[color]
    //         };
    //     });
    //     return colorStyleMap;
    // }

    imageBlockRenderer = (block: any) => {
        if (block.getType() === 'atomic') {
            return {
                component: (props: any) => {
                    if (!props.block.getEntityAt(0)) {
                        return null;
                    }

                    const entity = props.contentState.getEntity(props.block.getEntityAt(0));
                    let component;

                    if (entity.getType() === 'IMAGE') {
                        const { src, alt, width, height  } = entity.getData();
                        component = <img src={ src } alt={ alt } width={ '100%' }/>;
                    }

                    return component;
                },
                editable: false,
            };
        }
        return null;
    }

    /*
    protected renderEditor() {
        return <>
            <div>dsa</div>
            { super.renderEditor() }
        </>
    }
    */

    // Overridable method to add stuff to the editor window
    protected renderEditor() {
        const EditorComponent = Editor as JSX.ElementType; // hack to not fail with React 19 typings
        return (
            <EditorComponent
                editorState={ this.editorState }
                onChange={ this.handleChange }
                placeholder={ this.currentValue === '' && this.props.placeholder }
                readOnly={ this.props.isReadonly }
                ref={ (editor: any) => {
                    this.editor = editor;
                } }
                handleKeyCommand={ this.handleKeyCommand }
                // customStyleMap={ this.getColorStyleMap(defaultTextColors) }
                blockRendererFn={ this.imageBlockRenderer }
                blockRenderMap={ extendedBlockRenderMap as any }
                onTab={ (event: React.KeyboardEvent<any>) => {
                    const newEditorState = RichUtils.onTab(
                        event,
                        this.editorState,
                        2,
                    );
                    if (newEditorState !== this.editorState) {
                        this.handleChange(newEditorState);
                    }
                } }
            />
        );
    }

    render() {

        const defaultStructure: ToolbarButton[] = [
            'bold', 'italic', 'underline', 'link', 'separator', 'header', 'unordered-list', 'ordered-list', 'separator', 'image', 'separator', 'undo', 'redo',
        ];

        // const defaultTextColors: ToolbarTextColor[] = ['sky', 'grass', 'carbon', 'night', 'cobalt', 'lavanda', 'fuchsia', 'fire', 'sun'];

        const editorClass = this.props.customClass ? this.props.customClass : [css.typographyLoveship, css.typography14];

        const structure = this.props.structure || defaultStructure;

        return (
            <div className={ cx(css.container, this.props.cx, uuiMarkers.clickable, uuiElement.input) }>
                { !this.props.isReadonly && structure.length > 0 && <Toolbar
                    structure={ this.props.structure || defaultStructure }
                    // textColors={ this.props.textColors || defaultTextColors }
                    value={ this.editorState }
                    onValueChange={ this.handleChange }
                /> }
                <div className={ cx("public-DraftEditor-container", editorClass) } onClick={ this.focus } >
                    { this.renderEditor() }
                </div>
            </div>
        );
    }
}
