import React from 'react';
import { Dropdown, DropdownContainer, FlexCell, FlexRow, IconContainer, Text } from '@epam/promo';
import { IDropdownToggler } from '@epam/uui';
import { DropdownBodyProps } from '@epam/uui-components';
import { ReactComponent as myIcon } from '@epam/assets/icons/common/notification-warning-outline-18.svg';
import css from './WithLinkExample.scss';

export default function LinkTooltipExample() {
    const renderDropdownBody = (props: DropdownBodyProps) => (
        <DropdownContainer showArrow={ true } cx={ css.container } { ...props }>
            <FlexCell width='auto' >
                <Text cx={ css.header } fontSize='14' lineHeight='18' font='sans-semibold'>Deprecation “Working from home”</Text>
                <Text cx={ css.content } fontSize='12' lineHeight='18'>The text field longer be supported. Deprecated date Dec 20, 2022. <a href="#">Read KB</a></Text>
            </FlexCell>
        </DropdownContainer>
    );

    return (
      <FlexRow alignItems='center'>
        <Text fontSize='14'>Working from home allowed for employees only</Text>
        <Dropdown
            renderBody={ (props) => renderDropdownBody(props) }
            openOnHover={ true }
            closeOnMouseLeave='boundary'
            placement='top'
            modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            renderTarget={ (props: IDropdownToggler) => <IconContainer icon={ myIcon } color='amber' style={ {justifyContent: 'center', marginLeft: '3px'} } { ...props } /> }
        />
      </FlexRow>


    );
}