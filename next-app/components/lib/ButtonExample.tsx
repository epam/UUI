import {
    Badge,
    Button,
    Dropdown,
    FlexCell,
    FlexRow, LinkButton,
    MultiSwitch,
    NotificationCard,
    Panel,
    Text,
    Tooltip,
} from '@epam/promo';
import {
    IDropdownToggler,
    INotification, useUuiContext,
} from "@epam/uui-core";
import React, {useState} from "react";
import {BasicModalExample} from "../Modal";
import Link from 'next/link';

export const ButtonExample = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const svc = useUuiContext();

    const handleSuccess = () => {
        console.log('Success Click');
        svc.uuiNotifications.show((props: INotification) =>
            <NotificationCard id={ 1 } key={ 'keyProps' } color='gray60' onClose={ () => null } onSuccess={ () => null } >
                Common notification
            </NotificationCard>);
        svc.uuiAnalytics.sendEvent({
            name: "click",
            category: "button",
            label: "directly_sent",
        });
    };

    const renderDropdownBody = () => {
        return (
            <Panel background='white' shadow={ true }>
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
                <Badge color='blue' fill='solid' caption='Status' />
                <Badge color='blue' fill='semitransparent' caption='Status' />
                <Badge color='blue' fill='transparent' caption='Status' />
            </FlexRow>
        </Panel>
    );
};