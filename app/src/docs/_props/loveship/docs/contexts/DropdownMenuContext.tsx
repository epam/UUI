import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import {
    Panel, FlexRow, Button, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter, Tooltip, DropdownMenuCheckbox, DropdownMenuSearch,
} from '@epam/loveship';
import { Dropdown } from '@epam/uui-components';
import { ReactComponent as PencilIcon } from '@epam/assets/icons/common/content-edit-18.svg';
import { ReactComponent as TrashIcon } from '@epam/assets/icons/common/action-delete-18.svg';

interface DropdownComponentState {
    checkboxValue: boolean;
    searchValue: string;
}

export class DropdownMenuContext extends React.Component<DemoComponentProps, DropdownComponentState> {
    public static displayName = 'DropdownMenu';

    state = {
        checkboxValue: false,
        searchValue: '',
    };

    renderBody(color: 'white' | 'night') {
        const { DemoComponent, props } = this.props;
        return (
            <DropdownMenuBody color={ color }>
                <DropdownMenuSearch value={ this.state.searchValue } onValueChange={ (newValue) => this.setState({ searchValue: newValue }) } placeholder="Log in as" />
                <DropdownMenuButton icon={ PencilIcon } caption="Export" />
                <Tooltip placement="left" content="Import tools from current page">
                    <DropdownMenuButton noIcon caption="Import" />
                </Tooltip>
                <DropdownMenuButton isDropdown dropdownIconPosition="left" caption="Manage external feedback" />
                <DemoComponent { ...props } />
                <DropdownMenuButton icon={ TrashIcon } caption="Overwrite Titles" />
                <DropdownMenuCheckbox
                    value={ this.state.checkboxValue }
                    onValueChange={ () => this.setState({ checkboxValue: !this.state.checkboxValue }) }
                    label="Enable toolbar"
                />
                <DropdownMenuSplitter />
                <DropdownMenuButton noIcon caption="Help" />
                <Tooltip placement="left" content="Cancel tools dropdown menu">
                    <DropdownMenuButton noIcon caption="Cancel" />
                </Tooltip>
            </DropdownMenuBody>
        );
    }

    renderWhite = () => {
        return this.renderBody('white');
    };

    renderNight = () => {
        return this.renderBody('night');
    };

    render() {
        return (
            <Panel margin="24">
                <FlexRow>
                    <Dropdown renderTarget={ (props) => <Button caption="white" { ...props } /> } renderBody={ this.renderWhite } />
                    <Dropdown renderTarget={ (props) => <Button caption="night" { ...props } /> } renderBody={ this.renderNight } />
                </FlexRow>
            </Panel>
        );
    }
}
