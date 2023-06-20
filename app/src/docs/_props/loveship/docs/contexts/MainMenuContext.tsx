import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { MainMenu } from '@epam/loveship';
import css from './MainMenuContext.module.scss';

export class MainMenuContext extends React.Component<DemoComponentProps> {
    public static displayName = 'Main Menu';
    render() {
        const { DemoComponent, props } = this.props;

        return (
            <MainMenu cx={ css.container }>
                <DemoComponent { ...props } />
            </MainMenu>
        );
    }
}
