import React, { useCallback, useState } from 'react';
import css from './PresetInput.module.scss';
import { TextInput } from '../../inputs';
import { FlexCell } from '../../layout';
import { ITablePreset } from '@epam/uui-core';
import { UUI_PRESETS_PANEL_INPUT } from './constants';

interface IPresetInputProps {
    onCancel: () => void;
    onSuccess?: (name: string) => Promise<any>;
    preset?: ITablePreset;
}

export function PresetInput(props: IPresetInputProps) {
    const [presetCaption, setPresetCaption] = useState(props.preset?.name || '');

    const cancelActionHandler = useCallback(() => {
        setPresetCaption('');
        props.onCancel();
    }, [props.onCancel]);

    const acceptActionHandler = useCallback(async () => {
        if (presetCaption) {
            await props.onSuccess(presetCaption);
        }
        props.onCancel();
    }, [presetCaption]);

    const newPresetOnBlurHandler = useCallback(() => {
        if (presetCaption.length) {
            return;
        }
        props.onCancel();
    }, [presetCaption.length, props.onCancel]);

    return (
        <FlexCell cx={ [css.presetInputCell, UUI_PRESETS_PANEL_INPUT] } minWidth={ 180 }>
            <TextInput
                cx={ css.presetInput }
                onValueChange={ setPresetCaption }
                value={ presetCaption }
                onCancel={ cancelActionHandler }
                onAccept={ acceptActionHandler }
                onBlur={ newPresetOnBlurHandler }
                autoFocus
                maxLength={ 50 }
            />
        </FlexCell>
    );
}
