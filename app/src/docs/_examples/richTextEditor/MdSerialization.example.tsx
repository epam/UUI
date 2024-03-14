import React, { useMemo, useState } from 'react';
import {
    Panel, FlexRow, Switch,
} from '@epam/promo';
import {
    SlateEditor,
    EditorValue,
    createSerializer,
    createDeserializer,
    mdSerializationsWorkingPlugins,
} from '@epam/uui-editor';
import css from './SlateEditorBasicExample.module.scss';
import { demoData } from '@epam/uui-docs';

const serializeMd = createSerializer('md');
const deserializeMd = createDeserializer('md');

export default function SlateEditorBasicExample() {
    const [value, setValue] = useState<EditorValue>(demoData.slateMdSerializationInitialData);

    const [serializedMd, setSerializedMd] = useState('');
    const [type, setType] = React.useState<'view' | 'edit'>('edit');

    const onChangeEditorValue = (newValue: EditorValue) => {
        setValue(newValue);
    };

    const onToggleViewMode = () => {
        if (type === 'edit') {
            const x = serializeMd(value);
            setSerializedMd(x);
            setType('view');
        } else {
            setValue(deserializeMd(serializedMd));
            setType('edit');
        }
    };

    const deserialized = useMemo(() => {
        return deserializeMd(serializedMd);
    }, [serializedMd]);

    return (
        <Panel cx={ css.root }>
            <FlexRow spacing="18" vPadding="12">
                <Switch
                    value={ type === 'view' }
                    onValueChange={ onToggleViewMode }
                    label="View mode"
                />
            </FlexRow>

            <SlateEditor
                key={ type }
                value={ type === 'view' ? deserialized : value }
                isReadonly={ type === 'view' }
                onValueChange={ onChangeEditorValue }
                mode="form"
                placeholder="Add description"
                minHeight={ 300 }
                fontSize="14"
                plugins={ mdSerializationsWorkingPlugins }
            />
        </Panel>
    );
}
