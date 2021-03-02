import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { MainMenu } from '../../components';
import * as css from './MainMenuContext.scss';

export class MainMenuContext extends React.Component<DemoComponentProps, any> {
    public static displayName = "Main Menu";
    render() {
        const { DemoComponent, props } = this.props;

        return (
            <MainMenu cx={ css.container }>
                <DemoComponent { ...props } />
            </MainMenu>
        );
    }
}