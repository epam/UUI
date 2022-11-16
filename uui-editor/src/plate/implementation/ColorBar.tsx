import * as React from 'react';
import { uuiSkin } from "@epam/uui-core";
import { ToolbarButton } from "@udecode/plate";

import { ToolbarButton as UUIToolbarButton } from './ToolbarButton';

import { ReactComponent as ClearIcon } from "../icons/text-color-default.svg";
import { ReactComponent as ColorIcon } from '../icons/text-color-select.svg';

const { FlexRow } = uuiSkin;

export function ColorBar({ updateColor, clearColor }: any) {
    return <FlexRow rawProps={ { style: { background: '#303240' } } }>
        <ToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            isActive={ false }
            icon={ <UUIToolbarButton onClick={ () => {} } isActive={ false } icon={ ClearIcon } /> }
            onMouseDown={ clearColor }
        />
        <ToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            iconColor='red'
            isActive={ false }
            icon={ <UUIToolbarButton onClick={ () => {} } iconColor='red' isActive={ false } icon={ ColorIcon } /> }
            onMouseDown={ () => updateColor('#A72014') }
        />
        <ToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            iconColor='amber'
            isActive={ false }
            icon={ <UUIToolbarButton onClick={ () => {} } iconColor='amber' isActive={ false } icon={ ColorIcon } /> }
            onMouseDown={ () => updateColor('#995A00') }
        />
        <ToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            iconColor='green'
            isActive={ false }
            icon={ <UUIToolbarButton onClick={ () => {} } iconColor='green' isActive={ false } icon={ ColorIcon } /> }
            onMouseDown={ () => updateColor('#669900') }
        />
    </FlexRow>;
}