import React from 'react';
import { LinkButton, Text } from '@epam/uui';
import { useUuiContext, useAbortController } from '@epam/uui-core';

export default function ErrorHandlingTypesExample() {
    const svc = useUuiContext();
    const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';
    const { getAbortSignal } = useAbortController();
    
    return (
        <div>
            <Text>Page:</Text>
            <LinkButton size="30" onClick={ () => svc.uuiApi.processRequest(ORIGIN.concat(`api/error/status/${404}`), 'POST') } caption="404" />
            <LinkButton size="30" onClick={ () => svc.uuiApi.processRequest(ORIGIN.concat(`api/error/status/${403}`), 'POST') } caption="403" />
            <LinkButton size="30" onClick={ () => svc.api.errors.status(500) } caption="500" />
            <LinkButton size="30" onClick={ () => svc.api.errors.status(503) } caption="503" />

            <Text>Notification:</Text>
            <LinkButton
                onClick={ () => svc.uuiApi.processRequest(ORIGIN.concat(`api/error/status/${403}`), 'POST', null, { errorHandling: 'notification', signal: getAbortSignal() }).catch(() => {}) }
                caption="403 (notification)"
                size="30"
            />

            <Text>Manual:</Text>
            <LinkButton
                onClick={ () => svc.uuiApi.processRequest(ORIGIN.concat(`api/error/status/${405}`), 'POST', null, { errorHandling: 'manual', signal: getAbortSignal() }).catch(() => alert('Error occurred')) }
                caption="405 (manual)"
                size="30"

            />
        </div>
    );
}
