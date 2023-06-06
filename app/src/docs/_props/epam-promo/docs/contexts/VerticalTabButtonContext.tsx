import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { Panel, FlexCell, FlexRow } from '@epam/promo';
import { TabButtonMods } from '@epam/uui';

interface DemoComponentState {
    activeTab: 'Main' | 'demoTab' | 'Tools' | 'Options';
}

export class VerticalTabButtonContext extends React.Component<DemoComponentProps<ButtonProps & TabButtonMods>, DemoComponentState> {
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
            <Panel background="white" margin="24">
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
                            isLinkActive={ this.state.activeTab === 'demoTab' }
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
