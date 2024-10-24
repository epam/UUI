import * as React from 'react';
import cx from 'classnames';
import { BaseDocsBlock, DocExample } from '../common';
import css from './styles.module.scss';

export class RichTextEditorSerializersDoc extends BaseDocsBlock {
    title = 'Rich Text Editor Serializers';
    renderContent() {
        return (
            <span className={ cx(css.wrapper) }>
                <DocExample title="MD format" path="./_examples/richTextEditor/MdSerialization.example.tsx" />
                <DocExample title="HTML format" path="./_examples/richTextEditor/HtmlSerialization.example.tsx" />
            </span>
        );
    }
}
