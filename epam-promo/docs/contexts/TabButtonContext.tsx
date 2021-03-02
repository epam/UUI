import React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { Panel, FlexRow, TabButtonMods } from '../../components';
import * as css from './TabButtonContext.scss';

export class TabButtonContext extends React.Component<DemoComponentProps<ButtonProps & TabButtonMods>, any> {
    public static displayName = "TabButtonContext";

    state = {
        activeTab: '',
    };

    setTab(tab: string, onClick?: () => void) {
        this.setState({ activeTab: tab });
        onClick && onClick();
    }

    render() {
        const { DemoComponent, props } = this.props;
        return (
            <Panel cx={ css.container } margin='24' style={ { padding: '6px' } }>
                <FlexRow borderBottom background='none' size='36'>
                        <DemoComponent
                            caption={ 'Main' }
                            onClick={ () => this.setTab('Main', props.onClick) }
                            size={ props.size }
                        />
                        <DemoComponent
                            { ...props }
                            caption={ props.caption }
                            onClick={ () => this.setTab('demoTab', props.onClick) }
                            size={ props.size }
                        />
                        <DemoComponent
                            caption={ 'Tools' }
                            onClick={ () => this.setTab('Tools', props.onClick) }
                            size={ props.size }
                        />
                        <DemoComponent
                            caption={ 'Options' }
                            onClick={ () => this.setTab('Options', props.onClick) }
                            size={ props.size }
                        />
                </FlexRow>
            </Panel>
        );
    }
}
