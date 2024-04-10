import React, { useState } from 'react';
import { IDropdownToggler, useUuiContext } from '@epam/uui-core';
import { Badge, Button, Dropdown, FlexCell, FlexRow, LinkButton, NotificationCard, Panel, Text, Tooltip } from '@epam/uui';
import { MultiSwitch } from '@epam/promo';
import { BasicModalExample } from '../Modal';
import { TApi } from "../../helpers/apiDefinition";
import { AppContextType } from "../../helpers/appContext";

export const ButtonExample = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const svc = useUuiContext<TApi, AppContextType>();

    const handleSuccess = () => {
        console.log('Success Click');
        svc.uuiNotifications.show(() =>
            <NotificationCard id={ 1 } key={ 'keyProps' } color='info' onClose={ () => null } onSuccess={ () => null } >
                <Text>Common notification</Text>
            </NotificationCard>);
        svc.uuiAnalytics.sendEvent({
            name: "click",
            category: "button",
            label: "directly_sent",
        });
    };

    const renderDropdownBody = () => {
        return (
            <Panel shadow={ true }>
            <FlexRow padding='12' vPadding='12'>
                <Text>
                    Dropdown body content.
                    You can use any components as a dropdown body.
                </Text>
            </FlexRow>
            </Panel>
        );
    };

    return (
        <Panel cx={ 'withGap' } rawProps={ {
            style: { borderRadius: 0 },
        } }>
            <FlexRow>
                <FlexCell grow={ 100 }>
                    <Button caption={ "UUIButton" } onClick={ handleSuccess } />
                </FlexCell>
            </FlexRow>
            <FlexRow>
                <FlexCell grow={ 100 }>
                    {/*<Link href={ { pathname: '/components', query: { id: 'linkButton', name: 'sddsf' } } } >*/}
                        <LinkButton caption={ "LinkButton" } link={ { pathname: '/components', query: { id: 'linkButton', name: 'sddsf' } } } />
                    {/*</Link>*/}
                </FlexCell>
            </FlexRow>
            <FlexRow >
                    <Dropdown
                        renderBody={ () => renderDropdownBody() }
                        renderTarget={ (props: IDropdownToggler) => <Button caption='Click to open' { ...props } /> }
                    />

                    <Dropdown
                        renderBody={ () => renderDropdownBody() }
                        renderTarget={ (props: IDropdownToggler) => <Button caption='Hover to open' { ...props } /> }
                        openOnHover={ true }
                        closeOnMouseLeave='toggler'
                    />
            </FlexRow>
            <FlexRow>
                <Tooltip content='Some text' placement={ 'right' }>
                    <Button
                        caption='Show modal with tooltip'
                        onClick={ () => {
                            return svc.uuiModals.show((props) => <BasicModalExample { ...props }/>).catch(console.log);
                        } }
                    />
                </Tooltip>
            </FlexRow>
            <FlexRow>
                <MultiSwitch
                    items={ [{ id: 'Edit', caption: 'Edit' }, { id: 'isDisabled', caption: 'Disabled' }, { id: 'isReadOnly', caption: 'ReadOnly' }] }
                    value={ isDisabled ? 'isDisabled' : isReadOnly ? 'isReadOnly' : 'Edit' }
                    onValueChange={ (val: string) => {
                        if (val === 'Edit') {
                            setIsDisabled(false);
                            setIsReadOnly(false);
                        } else if (val === 'isDisabled') {
                            setIsDisabled(true);
                            setIsReadOnly(false);
                        } else {
                            setIsDisabled(true);
                            setIsReadOnly(false);
                        }
                    } }
                    color='blue'
                    size='24'
                />
            </FlexRow>
            <FlexRow cx={ 'withGap' }>
                <Badge color='info' fill='solid' caption='Status' />
                <Badge color='success' fill='solid' caption='Status' />
                <Badge color='critical' fill='solid' caption='Status' />
            </FlexRow>
        </Panel>
    );
};
