import * as React from "react";
import { ColorBar } from "../../implementation/ColorBar";
import * as colorIcon from '../../icons/text-color-normal.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { Dropdown } from '@epam/uui-components';

export const colorPlugin = () => {
    return {
        toolbarButtons: [ColorButton],
    };
};

const ColorButton = (editorProps: { editor: any }) => {
    return <Dropdown
        renderTarget={ (props) => <ToolbarButton
            icon={ colorIcon }
            isActive={ false }
            onClick={ () => null }
            { ...props }
        /> }
        renderBody={ () => <ColorBar editor={ editorProps.editor } /> }
        placement='top-start'
        modifiers={ { offset: { offset: '0,3px' } } }
    />;
};