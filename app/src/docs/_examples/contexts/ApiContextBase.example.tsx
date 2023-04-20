import React from 'react';
import { LinkButton, Text, FlexRow } from '@epam/promo';
import { useUuiContext } from '@epam/uui-core';

export default function ApiContextBaseExample() {
    const svc = useUuiContext();
    const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';

    return (
        <div>
            <Text>Examples of error pages (reload page to recover):</Text>

            <LinkButton onClick={ () => svc.uuiApi.processRequest(ORIGIN.concat(`api/error/status/${404}`), 'POST') } caption="404" />

            <LinkButton onClick={ () => svc.uuiApi.processRequest(ORIGIN.concat(`api/error/status/${403}`), 'POST') } caption="403" />

            <LinkButton
                onClick={ () => svc.uuiApi.processRequest(ORIGIN.concat(`api/error/status/${403}`), 'POST', null, { errorHandling: 'notification' }) }
                caption="403 (notification)"
            />

            <LinkButton
                onClick={ () =>
                    svc.uuiApi.processRequest(ORIGIN.concat(`api/error/status/${405}`), 'POST', null, { errorHandling: 'manual' }).catch(() => alert('Error occurred')) }
                caption="405 (manual)"
            />

            <LinkButton onClick={ () => svc.api.errors.status(500) } caption="500" />

            <LinkButton onClick={ () => svc.api.errors.status(503) } caption="503" />

            <LinkButton
                onClick={ () =>
                    svc.api
                        .withOptions({ errorHandling: 'manual' })
                        .errors.status(503)
                        .catch(() => alert('Error occurred')) }
                caption="503 (manual)"
            />

            <FlexRow>
                <LinkButton onClick={ () => svc.api.errors.authLost() } caption="Auth lost" />
                <Text>(error occur with 50% probability to be able to recover)</Text>
            </FlexRow>

            <FlexRow>
                <LinkButton onClick={ () => svc.api.errors.mock() } caption="Connection lost" />
                <Text>(To check network failure, enable 'offline' mode in Dev Tools)</Text>
            </FlexRow>
        </div>
    );
}
