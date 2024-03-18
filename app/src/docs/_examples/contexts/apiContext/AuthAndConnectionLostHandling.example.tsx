import React from 'react';
import { LinkButton, Text, FlexRow } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';

export default function AuthAndConnectionLostExample() {
    const svc = useUuiContext();

    return (
        <div>
            <Text>Auth lost:</Text>
            <FlexRow>
                <LinkButton onClick={ () => svc.api.errors.authLost() } caption="Auth lost" size="30" />
                <Text>&nbsp; (error occur with 50% probability to be able to recover)</Text>
            </FlexRow>

            <Text>Connection lost:</Text>
            <FlexRow>
                <LinkButton onClick={ () => svc.api.errors.mock() } caption="Connection lost" size="30" />
                <Text>&nbsp; (To check network failure, enable 'offline' mode in Dev Tools)</Text>
            </FlexRow>
        </div>
    );
}
