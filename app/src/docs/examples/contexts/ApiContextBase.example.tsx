import * as React from 'react';
import { LinkButton, Button, Text, FlexRow } from "@epam/promo";
import { svc } from "../../../services";

export class ApiContextBaseExample extends React.Component {
    render() {
        return (
            <div>
                <Text>Examples of error pages (reload page to recover):</Text>
                <LinkButton onClick={ () => svc.uuiApi.processRequest(`api/error/status/${400}`, 'POST') } caption='400' />

                <LinkButton onClick={ () => svc.uuiApi.processRequest(`api/error/status/${404}`, 'POST') } caption='404' />

                <LinkButton onClick={ () => svc.uuiApi.processRequest(`api/error/status/${403}`, 'POST', null, { errorHandling: 'notification' }) } caption='403 (notification)' />

                <LinkButton
                    onClick={ () => svc.uuiApi.processRequest(`api/error/status/${405}`, 'POST', null, { errorHandling: 'manual' }).catch(() => alert('Error occurred')) }
                    caption='405 (manual)'
                />

                <LinkButton onClick={ () => svc.api.errors.status(500) } caption='500' />

                <LinkButton onClick={ () => svc.api.withOptions({errorHandling: "manual"}).errors.status(501).catch(() => alert('Error occurred')) } caption='501 (manual)' />

                <LinkButton onClick={ () => svc.api.errors.status(503) } caption='503' />

                <FlexRow>
                    <LinkButton onClick={ () => svc.api.errors.authLost() } caption='Auth lost' />
                    <Text>(error occur with 50% probability to be able to recover)</Text>
                </FlexRow>

                <FlexRow>
                    <LinkButton onClick={ () => svc.api.errors.mock() } caption='Connection lost' />
                    <Text>(To check network failure, enable 'offline' mode in Dev Tools)</Text>
                </FlexRow>


            </div>
        );
    }
}