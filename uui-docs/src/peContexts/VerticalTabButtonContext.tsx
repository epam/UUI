import * as React from 'react';
import { DemoComponentProps } from '../types';
import { Panel, FlexCell, FlexRow, TabButtonProps } from '@epam/uui';

interface DemoComponentState {
    activeTab: 'Main' | 'demoTab' | 'Tools' | 'Options';
}

export class VerticalTabButtonContext extends React.Component<DemoComponentProps<TabButtonProps>, DemoComponentState> {
    public static displayName = 'VerticalTabButtonContext';
    state: DemoComponentState = {
        activeTab: 'Main',
    };

    setTab(tab: DemoComponentState['activeTab'], onClick?: () => void) {
        this.setState({ activeTab: tab });
        onClick?.();
    }

    render() {
        const { DemoComponent, props } = this.props;
        return (
            <Panel background="surface-main" margin="24" rawProps={ { style: { padding: '6px 0' } } }>
                <FlexRow>
                    <FlexCell grow={ 1 }>
                        <DemoComponent
                            caption="Main"
                            onClick={ () => this.setTab('Main', props.onClick) }
                            size={ props.size }
                            isLinkActive={ this.state.activeTab === 'Main' }
                        />
                        <DemoComponent
                            { ...props }
                            caption={ props.caption }
                            onClick={ () => this.setTab('demoTab', props.onClick) }
                            size={ props.size }
                            isLinkActive={ this.state.activeTab === 'demoTab' || props.isActive || props.isLinkActive }
                        />
                        <DemoComponent
                            caption="Tools"
                            onClick={ () => this.setTab('Tools', props.onClick) }
                            size={ props.size }
                            isLinkActive={ this.state.activeTab === 'Tools' }
                        />
                        <DemoComponent
                            caption="Options"
                            onClick={ () => this.setTab('Options', props.onClick) }
                            size={ props.size }
                            isLinkActive={ this.state.activeTab === 'Options' }
                        />
                    </FlexCell>
                </FlexRow>
            </Panel>
        );
    }
}
