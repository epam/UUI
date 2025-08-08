import * as React from 'react';
import { DemoComponentProps } from '../types';
import { Panel, FlexCell, FlexRow, FlexSpacer, Dropdown, IconButton, DropdownMenuBody, DropdownMenuButton, VerticalTabButtonProps } from '@epam/uui';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/navigation-more_vert-outline.svg';

interface DemoComponentState {
    activeTab: 'Main' | 'demoTab' | 'Tools' | 'Options';
}

export class VerticalTabButtonContext extends React.Component<DemoComponentProps<VerticalTabButtonProps<any, any>>, DemoComponentState> {
    public static displayName = 'VerticalTabButtonContext';
    state: DemoComponentState = {
        activeTab: 'Main',
    };

    setTab(tab: DemoComponentState['activeTab'], onClick?: () => void) {
        this.setState({ activeTab: tab });
        onClick?.();
    }

    renderDropdownList() {
        return (
            <>
                <FlexSpacer />
                <Dropdown
                    renderTarget={
                        (props) => (
                            <IconButton
                                { ...props }
                                icon={ MoreIcon }
                                size="24"
                                color="secondary"
                            />
                        )
                    }
                    renderBody={
                        (props) => (
                            <DropdownMenuBody { ...props }>
                                <DropdownMenuButton caption="Export" onClick={ () => {} } />
                                <DropdownMenuButton caption="Delete" onClick={ () => {} } />
                            </DropdownMenuBody>
                        )
                    }
                />
            </>
        );
    }

    render() {
        const { DemoComponent, props } = this.props;
        return (
            <Panel background="surface-main" margin="24" rawProps={ { style: { padding: '6px 0', width: '250px' } } }>
                <FlexRow>
                    <FlexCell grow={ 1 }>
                        <DemoComponent
                            caption="Main"
                            onClick={ () => this.setTab('Main', props.onClick) }
                            size={ props.size }
                            isActive={ this.state.activeTab === 'Main' }
                        />
                        <DemoComponent
                            { ...props }
                            caption={ props.caption }
                            onClick={ () => this.setTab('demoTab', props.onClick) }
                            size={ props.size }
                            isActive={ this.state.activeTab === 'demoTab' || props.isActive || props.isLinkActive }
                        />
                        <DemoComponent
                            caption="Tools"
                            onClick={ () => this.setTab('Tools', props.onClick) }
                            size={ props.size }
                            isActive={ this.state.activeTab === 'Tools' }
                        />
                        <DemoComponent
                            caption="Options"
                            onClick={ () => this.setTab('Options', props.onClick) }
                            size={ props.size }
                            isActive={ this.state.activeTab === 'Options' }
                            renderAddons={ this.renderDropdownList }
                        />
                    </FlexCell>
                </FlexRow>
            </Panel>
        );
    }
}
