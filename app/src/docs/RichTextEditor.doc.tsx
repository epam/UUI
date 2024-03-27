import * as React from 'react';
import cx from 'classnames';
import { BaseDocsBlock, DocExample } from '../common';
import css from './styles.module.scss';

export class RichTextEditorDoc extends BaseDocsBlock {
    title = 'Rich Text Editor';
    renderContent() {
        return (
            <span className={ cx(css.wrapper) }>
                <DocExample path="./_examples/richTextEditor/Basic.example.tsx" />
                <DocExample title="Inner scroll behavior" path="./_examples/richTextEditor/WithInnerScroll.example.tsx" />
            </span>
        );
    }
}
