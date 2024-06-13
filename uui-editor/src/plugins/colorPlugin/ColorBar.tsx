import * as React from 'react';
import { FlexRow } from '@epam/uui';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ClearIcon } from '../../icons/text-color-default.svg';
import { ReactComponent as ColorIcon } from '../../icons/text-color-select.svg';

import css from './ColorBar.module.scss';
import { getPluginOptions, useEditorRef } from '@udecode/plate-common';
import { COLOR_PLUGIN_KEY } from './constants';
import { ColorPluginOptions } from './types';

type IColorBar = {
    onColorUpdate: (color: string) => void;
    onColorClear: () => void;
    value?: string,
};

export function ColorBar({ onColorUpdate, onColorClear, value }: IColorBar) {
    const editorRef = useEditorRef();
    const { colors: colorProps } = React.useMemo(() => getPluginOptions<ColorPluginOptions>(
        editorRef,
        COLOR_PLUGIN_KEY,
    ), [editorRef]);

    const defaultColors = React.useMemo(() => (
        <React.Fragment>
            <ToolbarButton
                key="critical"
                onClick={ () => onColorUpdate('critical') }
                iconColor="red"
                isActive={ value === 'critical' }
                icon={ ColorIcon }
            />
            <ToolbarButton
                key="warning"
                onClick={ () => onColorUpdate('warning') }
                iconColor="amber"
                isActive={ value === 'warning' }
                icon={ ColorIcon }
            />
            <ToolbarButton
                key="success"
                onClick={ () => onColorUpdate('success') }
                iconColor="green"
                isActive={ value === 'success' }
                icon={ ColorIcon }
            />
        </React.Fragment>
    ), [onColorUpdate, value]);

    const userColors = React.useMemo(() =>
        colorProps?.map((color) => {
            return (
                <ToolbarButton
                    key={ color }
                    onClick={ () => onColorUpdate(color) }
                    isActive={ value === color }
                    color={ color }
                    icon={ ColorIcon }
                />
            );
        }), [colorProps, onColorUpdate, value]);

    const colors = userColors || defaultColors;
    return (
        <FlexRow cx={ css.wrapper }>
            <ToolbarButton
                key="clear"
                onClick={ onColorClear }
                isActive={ false }
                icon={ ClearIcon }
            />
            {colors}
        </FlexRow>
    );
}
