import * as React from 'react';
import { IAdaptiveItem, IHasChildren } from '@epam/uui';

export interface MainMenuCustomElementProps extends IAdaptiveItem, IHasChildren {
}

export class MainMenuCustomElement extends React.Component<MainMenuCustomElementProps, any> {
    render() {
        return (
            this.props.children
        );
    }
}
