import * as React from 'react';
import { Dropdown, IconButton, Panel } from '@epam/loveship';
import { createBlockStyleDropDownItem } from '../../../utils/createBlockStyleDropDownItem';
import { DraftBlockStyleButton } from '../../..';
import { ReactComponent as HeaderDropdownIcon } from '../../../icons/header_dropdown.svg';
import css from './HeaderDropdownButton.module.scss';
import { cx } from '@epam/uui-core';

const buttons: DraftBlockStyleButton[] = [
    {
        blockType: 'header-one',
        caption: 'Header 1',
    },
    {
        blockType: 'header-two',
        caption: 'Header 2',
    },
    {
        blockType: 'header-three',
        caption: 'Header 3',
    },
    {
        blockType: 'header-four',
        caption: 'Header 4',
    },
    {
        blockType: 'header-five',
        caption: 'Header 5',
    },
    {
        blockType: 'header-six',
        caption: 'Header 6',
    },
    {
        blockType: 'paragraph',
        caption: 'Paragraph',
    },
];

const headerButtons = buttons.map(b => createBlockStyleDropDownItem(b));

const renderDropdownBody = (props: any) => (
    <Panel
        background='white'
        shadow
        cx={ css.HeaderDropdownBody }
    >
        { headerButtons.map((HeaderButton, i) => <HeaderButton { ...props } key={ HeaderButton.name + i } />) }
    </Panel>
);

export const HeaderDropDownButton = (props: any) => (
    <div onMouseDown={ (event: React.MouseEvent<HTMLDivElement>) => { event.preventDefault(); } }>
        <Dropdown
            renderBody={ () => renderDropdownBody(props) }
            renderTarget={ (props: any) => (
                <IconButton
                    { ...props }
                    icon={ HeaderDropdownIcon }
                    color='night600'
                    cx={ cx('header-dropdown-button', { active: props.isOpen }) }
                />
            ) }
        />
    </div>
);
