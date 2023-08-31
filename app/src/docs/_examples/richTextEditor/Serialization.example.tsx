import React, { useState } from 'react';
import { Panel, FlexRow, Button, RichTextView } from '@epam/promo';
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
    isEditorValueEmpty,
    migrateSchema,
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
    const [value, setValue] = useState<EditorValue>(migrateSchema(demoData.slateSerializationInitialData));

    const [serializedHtml, setSerializedHtml] = useState(serializeHTML(value));
    const [type, setType] = React.useState<'html' | 'edit'>('edit');

    const onChangeEditorValue = (newValue: EditorValue) => {
        setValue(newValue);
    };

    const onView = () => {
        setSerializedHtml(serializeHTML(value));
        setType('html');
    };

    const onEdit = () => {
        setValue(deserializeHTML(serializedHtml));
        setType('edit');
    };

    return (
        <Panel cx={ css.root }>
            <FlexRow spacing="18" vPadding="12">
                {type === 'edit' && (
                    <Button
                        caption="View"
                        onClick={ onView }
                        isDisabled={ isEditorValueEmpty(value) }
                        size="30"
                    />
                )}
                {type === 'html' && (
                    <Button
                        caption="Edit"
                        onClick={ onEdit }
                        isDisabled={ !serializedHtml }
                        size="30"
                    />
                )}
            </FlexRow>
            {
                type === 'html'
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
