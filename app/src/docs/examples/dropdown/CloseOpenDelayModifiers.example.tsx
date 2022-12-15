import React from 'react';
import { Dropdown, DropdownBodyProps } from '@epam/uui-components';
import { Button, Text, FlexRow, DropdownContainer, FlexCell } from '@epam/promo';
import css from './HandleStateExample.scss';
import { Avatar, IDropdownToggler } from '@epam/uui';

export default function CloseOpenDelayModifiersExample() {
    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer vPadding='24' padding='18' { ...props }>
                <FlexRow alignItems='center' spacing='12'>
                    <Avatar
                        size='48'
                        alt='avatar'
                        img='https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50'
                    />

                    <FlexCell width='100%'>
                        <Text cx={ css.text } lineHeight='24' fontSize='16' color='gray80' font='sans-semibold'>John Doe</Text>
                        <Text cx={ css.text } lineHeight='18' fontSize='12' color='gray60'>Corporate Function Management | L3</Text>
                    </FlexCell>
                </FlexRow>
            </DropdownContainer>
        );
    };
    const DropdownTextRow = () => (
        <FlexRow vPadding='12' spacing='12' >
                <Dropdown
                    renderBody={ (props) => renderDropdownBody(props) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (open delay)" { ...props } /> }
                    openOnHover={ true }
                    openDelay={ 500 }
                    closeOnMouseLeave='toggler'
                />
                <Dropdown
                    renderBody={ (props) => renderDropdownBody(props) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (open delay)" { ...props } /> }
                    openOnHover={ true }
                    openDelay={ 500 }
                    closeOnMouseLeave='toggler'
                />
                <Dropdown
                    renderBody={ (props) => renderDropdownBody(props) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (open delay)" { ...props } /> }
                    openOnHover={ true }
                    openDelay={ 500 }
                    closeOnMouseLeave='toggler'
                />
            </FlexRow>
    );

    return (
        <div>
            { Array(6).fill(null).map((e, index) => <DropdownTextRow key={ index }/>) }
        </div>
    );
}