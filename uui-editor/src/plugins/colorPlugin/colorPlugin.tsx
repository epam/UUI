import * as React from "react";
import { ColorBar } from "../../implementation/ColorBar";
import { ReactComponent as ColorIcon } from '../../icons/text-color-normal.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { Dropdown } from '@epam/uui-components';
import { useSlate } from "slate-react";

export const colorPlugin = () => {
    return {
        toolbarButtons: [ColorButton],
    };
};

const ColorButton = () => {
    return <Dropdown
        renderTarget={ (props) => <ToolbarButton
            icon={ ColorIcon }
            isActive={ false }
            onClick={ () => null }
            { ...props }
        /> }
        renderBody={ () => <ColorBar /> }
        placement='top-start'
        modifiers={ [{ name: 'offset', options: { offset: [0, 3] } }] }
    />;
};