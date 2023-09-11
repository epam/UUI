import React, { useState } from 'react';
import { Panel, FlexRow, RichTextView, Switch } from '@epam/promo';
import {
    SlateEditor,
    imagePlugin,
    videoPlugin,
    baseMarksPlugin,
    linkPlugin,
    iframePlugin,
    quotePlugin,
    superscriptPlugin,
    headerPlugin,
    listPlugin,
    EditorValue,
    codeBlockPlugin,
    createSerializer,
    createDeserializer,
    paragraphPlugin,
} from '@epam/uui-editor';
import { demoData } from '@epam/uui-docs';
import css from './SlateEditorBasicExample.module.scss';

const plugins = [
    paragraphPlugin(),
    baseMarksPlugin(),
    headerPlugin(),
    superscriptPlugin(),
    listPlugin(),
    quotePlugin(),
    linkPlugin(),
    imagePlugin(),
    videoPlugin(),
    iframePlugin(),
    codeBlockPlugin(),
];

const serializeHTML = createSerializer();
const deserializeHTML = createDeserializer();

export default function SlateEditorBasicExample() {
    const [value, setValue] = useState<EditorValue>(demoData.slateSerializationInitialData);

    const [serializedHtml, setSerializedHtml] = useState('');
    const [type, setType] = React.useState<'view' | 'edit'>('edit');

    const onChangeEditorValue = (newValue: EditorValue) => {
        setValue(newValue);
    };

    const onToggleViewMode = () => {
        if (type === 'edit') {
            setSerializedHtml(serializeHTML(value));
            setType('view');
        } else {
            setValue(deserializeHTML(serializedHtml));
            setType('edit');
        }
    };

    return (
        <Panel cx={ css.root }>
            <FlexRow spacing="18" vPadding="12">
                <Switch value={ type === 'view' } onValueChange={ onToggleViewMode } label="View mode" />
            </FlexRow>
            {
                type === 'view'
                    ? (
                        <RichTextView cx={ css.richTextView } htmlContent={ serializedHtml } />
                    )
                    : (
                        <SlateEditor
                            value={ value }
                            onValueChange={ onChangeEditorValue }
                            isReadonly={ false }
                            plugins={ plugins }
                            mode="form"
                            placeholder="Add description"
                            minHeight="none"
                            fontSize="14"
                        />
                    )
            }
        </Panel>
    );
}
