import * as React from 'react';
import { BlockToolbarButton } from "@udecode/plate";
import { ReactComponent as ClearIcon } from "../icons/text-color-default.svg";
import { ReactComponent as H1Icon } from "../icons/heading-H1.svg";
import { ReactComponent as H2Icon } from "../icons/heading-H2.svg";
import { ReactComponent as H3Icon } from "../icons/heading-H3.svg";
import { ToolbarButton as UUIToolbarButton } from './ToolbarButton';

import { uuiSkin } from "@epam/uui-core";

const { FlexRow } = uuiSkin;

const CLEAR_TYPE = '';
const H1_TYPE = 'uui-richTextEditor-header-1';
const H2_TYPE = 'uui-richTextEditor-header-2';
const H3_TYPE = 'uui-richTextEditor-header-3';

export function HeaderBar() {
    return (
        <FlexRow rawProps={ {style: { background: '#303240' }} }>
            <BlockToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                type={ CLEAR_TYPE }
                inactiveType=''
                icon={ <UUIToolbarButton onClick={ () => {} } isActive={ false } icon={ ClearIcon } /> }
            />
            <BlockToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                type={ H1_TYPE }
                icon={ <UUIToolbarButton onClick={ () => {} } isActive={ false } icon={ H1Icon } /> }
            />
            <BlockToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                type={ H2_TYPE }
                icon={ <UUIToolbarButton onClick={ () => {} } isActive={ false } icon={ H2Icon } /> }
            />
            <BlockToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                type={ H3_TYPE }
                icon={ <UUIToolbarButton onClick={ () => {} } isActive={ false } icon={ H3Icon } /> }
            />
        </FlexRow>
    );
}