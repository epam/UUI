import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import {
    Panel, FlexRow, Button, DropdownMenuBody, DropdownMenuButton,
    DropdownMenuSplitter, Tooltip, DropdownMenuCheckbox, DropdownMenuSearch,
} from '../../components';
import { Dropdown } from '@epam/uui-components';
import * as pencilIcon from '../../components/icons/content-edit-18.svg';
import * as trashIcon from '../../components/icons/action-delete-18.svg';

export class DropdownMenuContext extends React.Component<DemoComponentProps, any> {
    public static displayName = "DropdownMenu";

    state = {
        checkboxValue: false,
        searchValue: '',
    };

    renderBody(color: 'white' | 'night') {
        const { DemoComponent, props } = this.props;
        return (
            <DropdownMenuBody color={ color }>
                <DropdownMenuSearch value={ this.state.searchValue } onValueChange={ (newValue => this.setState({ searchValue: newValue })) } placeholder='Log in as'/>
                <DropdownMenuButton icon={ pencilIcon } caption='Export' />
                <Tooltip placement='left' content='Import tools from current page'><DropdownMenuButton noIcon caption='Import' /></Tooltip>
                <DropdownMenuButton isDropdown dropdownIconPosition='left' caption='Manage external feedback' />
                <DemoComponent { ...props } />
                <DropdownMenuButton icon={ trashIcon } caption='Overwrite Titles' />
                <DropdownMenuCheckbox
                    value={ this.state.checkboxValue }
                    onValueChange={ () => this.setState({ checkboxValue: !this.state.checkboxValue }) }
                    label='Enable toolbar'/>
                <DropdownMenuSplitter />
                <DropdownMenuButton noIcon caption='Help' />
                <Tooltip placement='left' content='Cancel tools dropdown menu'><DropdownMenuButton noIcon caption='Cancel' /></Tooltip>
            </DropdownMenuBody>
        );
    }

    render() {
        return (
            <Panel margin="24" >
                <FlexRow>
                    <Dropdown
                        renderTarget={ props => <Button caption='white' { ...props } /> }
                        renderBody={ this.renderBody.bind(this, 'white') }
                    />
                    <Dropdown
                        renderTarget={ props => <Button caption='night' { ...props } /> }
                        renderBody={ this.renderBody.bind(this, 'night') }
                    />
                </FlexRow>
            </Panel>
        );
    }
}