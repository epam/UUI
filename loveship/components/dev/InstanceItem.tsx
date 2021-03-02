import React from 'react';
import { getCookie, setCookie } from '@epam/uui';
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
        return <MultiSwitch
            value={ getCookie(cookie.env) || this.props.defaultInstance }
            onValueChange={ env => {
                setCookie(cookie.env, env);
                window.location.reload();
            } }
            size='30'
            color="night700"
            items={ this.props.instances }
        />;
    }
}