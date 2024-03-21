import React, { useState } from 'react';
import {
    Panel, FlexRow, TextArea, MultiSwitch,
} from '@epam/promo';
import {
    SlateEditor,
    EditorValue,
    createSerializer,
    createDeserializer,
    defaultPlugins,
    boldPlugin,
    italicPlugin,
    linkPlugin,
    listPlugin,
    headerPlugin,
} from '@epam/uui-editor';
import css from './SlateEditorBasicExample.module.scss';
import { demoData } from '@epam/uui-docs';

const serializeMd = createSerializer('md');
const deserializeMd = createDeserializer('md');

const switchItems = [{
    id: 'slate',
    caption: 'Slate',
}, {
    id: 'md',
    caption: 'Markdown',
}];

const plugins = [
    ...defaultPlugins,
    boldPlugin(),
    italicPlugin(),
    linkPlugin(),
    listPlugin(),
    headerPlugin(),
];

export default function SlateEditorBasicExample() {
    const [value, setValue] = useState<EditorValue>(
        () => deserializeMd(demoData.slateMdSerializationInitialData),
    );

    const [mdContent, setMdContent] = useState('');
    const [type, setType] = React.useState<'md' | 'slate'>('slate');

    const onToggleViewMode = () => {
        if (type === 'slate') {
            setMdContent(serializeMd(value));
            setType('md');
        } else {
            setValue(deserializeMd(mdContent));
            setType('slate');
        }
    };

    return (
        <Panel cx={ css.root }>
            <FlexRow columnGap="18" vPadding="12">
                <MultiSwitch
                    items={ switchItems }
                    value={ type }
                    onValueChange={ onToggleViewMode }
                    color="primary"
                />
            </FlexRow>

            {type === 'slate'
                ? (
                    <SlateEditor
                        value={ value }
                        onValueChange={ (newValue) => {
                            setValue(newValue);
                        } }
                        mode="form"
                        placeholder="Add description"
                        minHeight={ 150 }
                        fontSize="14"
                        plugins={ plugins }
                        toolbarPosition="fixed"
                    />
                ) : (
                    <TextArea
                        value={ mdContent }
                        onValueChange={ (v) => {
                            setMdContent(v);
                        } }
                        rows={ 22 }
                        placeholder="Please type markdown here"
                    />
                )}
        </Panel>
    );
}
