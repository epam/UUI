import React from 'react';
import { Button, HintNotification } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';

export default function UuiServicesUsageExample() {
    const svc = useUuiContext();

    return (
        <>
            <Button onClick={ () => svc.uuiRouter.redirect({ pathname: 'path', query: {} }) } />
            <Button
                onClick={ () => svc.uuiNotifications.show((props) => <HintNotification { ...props }></HintNotification>) }
            />
        </>
    );
}
