import React from 'react';
import { devLogger, getCookie, setCookie } from '@epam/uui-core';
import { MultiSwitch } from '../inputs';

interface Instance {
    id: string;
    caption: string;
}

interface InstanceItemProps {
    instances: Instance[];
    defaultInstance: string;
}

const cookie = {
    env: 'uui-api-env',
};

export class InstanceItem extends React.Component<InstanceItemProps> {
    render() {
        if (__DEV__) {
            devLogger.warn('InstanceItem is deprecated and will be removed in future release.');
        }
        return (
            <MultiSwitch
                value={ getCookie(cookie.env) || this.props.defaultInstance }
                onValueChange={ (env) => {
                    setCookie(cookie.env, env);
                    window.location.reload();
                } }
                size="30"
                color="night600"
                items={ this.props.instances }
            />
        );
    }
}
