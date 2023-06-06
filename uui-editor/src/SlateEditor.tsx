import * as React from 'react';
import { Editor, Plugin, getEventTransfer } from 'slate-react';
import SoftBreak from "slate-soft-break";
import htmlclean from 'htmlclean';
import { KeyUtils, SchemaProperties, Value } from 'slate';
import { ScrollBars } from '@epam/uui-components';
import { IEditable, UuiContexts, uuiMod, IHasCX, UuiContext, cx, IHasRawProps } from '@epam/uui-core';
import {Toolbar} from "./implementation/Toolbar";
import {Sidebar} from './implementation/Sidebar';
import { baseMarksPlugin, utilsPlugin, paragraphPlugin } from "./plugins";
import { getSerializer, isEditorEmpty } from './helpers';
import css from './SlateEditor.module.scss';

export const slateEditorEmptyValue: any = Value.fromJS({
    document: {
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                key: KeyUtils.create(),
                nodes: [
                    {
                        object: 'text',
                        text: '',
                    },
                ],
            },
        ],
    },
} as any);

const schema: SchemaProperties = {
    blocks: {
        attachment: {
            isVoid: true,
        },
        iframe: {
            isVoid: true,
        },
        separatorBLock: {
            isVoid: true,
        },
        video: {
            isVoid: true,
        },
        loader: {
            isVoid: true,
        },
        image: {
            isVoid: true,
        },
    },
    inlines: {
        placeholder: {
            isVoid: true,
        },
    },
};

export const defaultPlugins = [
    SoftBreak({ shift: true }),
    paragraphPlugin(),
    utilsPlugin(),
];

export const basePlugins = [
    baseMarksPlugin(),
    ...defaultPlugins,
];

interface SlateEditorProps extends IEditable<Value | null>, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    isReadonly?: boolean;
    plugins?: Plugin[];
    autoFocus?: boolean;
    minHeight?: number | 'none';
    placeholder?: string;
    mode?: 'form' | 'inline';
    fontSize?: '14' | '16';
    onKeyDown?: (event: KeyboardEvent, value: Editor['value'] | null) => void;
    onBlur?: (event: FocusEvent, value: Editor['value'] | null) => void;
    scrollbars?: boolean;
}

interface SlateEditorState {
    inFocus?: boolean;
}

export class SlateEditor extends React.Component<SlateEditorProps, SlateEditorState> {
    editor: Editor;
    static contextType = UuiContext;
    context: UuiContexts;
    serializer = getSerializer(this.props.plugins);

    state = {
        inFocus: !!this.props.autoFocus,
    };

    onPaste = (event: any, editor: Editor, next: () => any) => {
        const transfer: any = getEventTransfer(event);
        if (transfer.type !== 'html') return next();
        const html = htmlclean(transfer.html);
        const { document } = this.serializer.deserialize(html);
        editor.insertFragment(document);
        event.preventDefault();
    }

    onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {
        if (event.keyCode === 9 && !((this.editor as any).isList('unordered-list') || (this.editor as any).isList('ordered-list'))) {
            event.preventDefault();
            return;
        }

        this.props.onKeyDown && this.props.onKeyDown(event, editor.value);

        return next();
    }

    isEmpty = () => {
        if (!this.editor || !this.props.value) {
            return true;
        }

        return isEditorEmpty(this.props.value);
    }

    onChange = (props: any) => {
        if (props.value.selection.isFocused !== this.state.inFocus) {
            this.setState({ inFocus: props.value.selection.isFocused });
        }

        this.props.onValueChange(props.value);
    }

    onBlur = (e: any, editor: Editor, next: () => any) => {
        if (!editor.value.selection.isFocused) return;
        if (e.relatedTarget && e.relatedTarget.closest('.slate-prevent-blur')) {
            return e.preventDefault();
        }

        this.props.onBlur?.(e, editor.value);
        return next();
    }

    onFocus = (e: any, editor: Editor, next: () => any) => {
        if (editor.value.selection.isFocused) return;
        return next();
    }

    renderEditor = () => (<>
        <Editor
            readOnly={ this.props.isReadonly }
            className={ cx(css.typographyPromo, !this.props.isReadonly && css.contentEditable, this.props.fontSize == '16' ? css.typography16 : css.typography14) }
            renderInline={ (pr, ed, next) => next() }
            onKeyDown={ this.onKeyDown as any }
            autoFocus={ this.props.autoFocus }
            plugins={ this.props.plugins }
            schema={ schema }
            onFocus={ this.onFocus }
            onBlur={ this.onBlur }
            value={ this.props.value || slateEditorEmptyValue }
            onChange={ this.onChange }
            style={ { minHeight: this.props.minHeight || 350, padding: '0 24px', overflow: 'hidden' } }
            ref={ (editor) => this.editor = editor }
            onPaste={ this.onPaste }
            spellCheck={ !this.props.isReadonly }
        />
        { this.isEmpty() &&
            (
                <div className={ cx(css.placeholder, this.props.fontSize === '16' ? css.placeholder16 : css.placeholder14) }>
                    { this.props.placeholder }
                </div>
            )
        }
        <Toolbar plugins={ this.props.plugins } editor={ this.editor } />
        <Sidebar plugins={ this.props.plugins } editor={ this.editor } isReadonly={ this.props.isReadonly } />
    </>)

    render() {
        return (
            <div
                className={ cx(
                    this.props.cx,
                    css.container,
                    css['mode-' + (this.props.mode || 'form')],
                    (!this.props.isReadonly && this.state.inFocus) && uuiMod.focus,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.scrollbars && css.withScrollbars,
                ) }
                { ...this.props.rawProps }
            >
                { this.props.scrollbars
                    ? <ScrollBars cx={ css.scrollbars }>
                        { this.renderEditor() }
                    </ScrollBars>
                    : this.renderEditor()
                }
            </div>
        );
    }
}
