import React, { useState } from 'react';
import {
    Panel, FlexRow, Switch,
} from '@epam/promo';
import {
    SlateEditor,
    EditorValue,
    createSerializer,
    createDeserializer,
    mdSerializationsWorkingPlugins,
    SlateEditorProps,
} from '@epam/uui-editor';
import css from './SlateEditorBasicExample.module.scss';
import { mdInitialValue } from './md-initial-value';

const serializeMd = createSerializer('md');
const deserializeMd = createDeserializer('md');

export default function SlateEditorBasicExample() {
    const [value, setValue] = useState<EditorValue>(deserializeMd(mdInitialValue));

    const [serializedMd, setSerializedMd] = useState('');
    const [type, setType] = React.useState<'view' | 'edit'>('edit');

    const onChangeEditorValue = (newValue: EditorValue) => {
        setValue(newValue);
    };

    const onToggleViewMode = () => {
        if (type === 'edit') {
            setSerializedMd(serializeMd(value));
            setType('view');
        } else {
            setValue(deserializeMd(serializedMd));
            setType('edit');
        }
    };

    const slateProps: SlateEditorProps = {
        value: value,
        onValueChange: onChangeEditorValue,
        isReadonly: false,
        mode: 'form',
        placeholder: 'Add description',
        minHeight: 300,
        fontSize: '14',
    };

    return (
        <Panel cx={ css.root }>
            <FlexRow spacing="18" vPadding="12">
                <Switch
                    value={ type === 'view' } onValueChange={ onToggleViewMode }
                    label="View mode"
                />
            </FlexRow>

            {type === 'view'
                ? (
                    <SlateEditor
                        { ...slateProps }
                        value={ deserializeMd(serializedMd) }
                        isReadonly
                    />
                )
                : (
                    <SlateEditor
                        { ...slateProps }
                        plugins={ mdSerializationsWorkingPlugins }
                    />
                )}
        </Panel>
    );
}
