import React, { useMemo } from 'react';
import { IPropDocEditor } from '../types';
import { IconPickerWithInfo } from '../components/iconPicker/IconPicker';
import { Icon } from '@epam/uui-core';

export function IconEditor(props: IPropDocEditor<Icon>) {
    const { exampleId, onExampleIdChange, examples } = props;
    const icons = useMemo(() => examples.map(({ name, value }) => ({ id: name, name, icon: value })), [examples]);
    const value = exampleId ? examples.find(({ id }) => id === exampleId)?.name : undefined;

    /** exampleId === iconId here */
    return (
        <IconPickerWithInfo
            icons={ icons }
            value={ value }
            onValueChange={
                (icon) => {
                    const foundExample = examples.find(({ name }) => name === icon?.id);
                    onExampleIdChange(foundExample?.id);
                }
            }
            enableInfo={ true }
        />
    );
}
