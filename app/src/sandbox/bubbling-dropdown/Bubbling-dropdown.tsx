import React, { useState } from 'react';
import { Dropdown } from '@epam/uui-components';
import { Text, FlexRow, DropdownContainer, LinkButton, FlexCell, RichTextView, Anchor, PickerInput, Button, Panel } from '@epam/promo';
import { IDropdownToggler, DropdownBodyProps, useArrayDataSource } from '@epam/uui-core';

const languageLevels = [
    { id: 2, level: 'A1' }, { id: 3, level: 'A1+' }, { id: 4, level: 'A2' }, { id: 5, level: 'A2+' }, { id: 6, level: 'B1' }, { id: 7, level: 'B1+' }, { id: 8, level: 'B2' }, { id: 9, level: 'B2+' }, { id: 10, level: 'C1' }, { id: 11, level: 'C1+' }, { id: 12, level: 'C2' },
];

export function BubblingDropdown() {
    const [value, onValueChange] = useState(null);
    const [singlePickerValue, singleOnValueChange] = useState(null);

    const dataSource = useArrayDataSource(
        {
            items: languageLevels,
        },
        [],
    );

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer showArrow={ true } vPadding="24" padding="18" { ...props }>
                <FlexRow alignItems="center" spacing="12">

                    <FlexCell width="100%">
                        <Text lineHeight="24" fontSize="16" color="gray80" font="sans-semibold">
                            John Doe
                        </Text>
                        <PickerInput
                            dataSource={ dataSource }
                            value={ singlePickerValue }
                            onValueChange={ singleOnValueChange }
                            getName={ (item) => item.level }
                            entityName="Language level"
                            selectionMode="single"
                            valueType="id"
                            sorting={ { field: 'level', direction: 'asc' } }
                        />
                        <hr />
                        <PickerInput
                            dataSource={ dataSource }
                            value={ singlePickerValue }
                            onValueChange={ singleOnValueChange }
                            getName={ (item) => item.level }
                            entityName="Language level"
                            selectionMode="single"
                            valueType="id"
                            sorting={ { field: 'level', direction: 'asc' } }
                        />
                    </FlexCell>
                </FlexRow>
            </DropdownContainer>
        );
    };

    return (
        <div style={ { flexGrow: 1, margin: '24px' } }>
            <FlexRow>
                <Anchor href="https://github.com/epam/UUI/issues/1385" target="_blank">
                    <RichTextView>
                        <h3>The issue: Input stays focused in case of outside click #1385</h3>
                        <p>To reproduce: click to open the Dropdown and then open any PickerInput, and when it's open try to click on the DropdownBody.</p>
                        <p>The focus still present on the PickerInput.</p>
                    </RichTextView>
                </Anchor>
            </FlexRow>
            <FlexRow columnGap="24">
                <Dropdown
                    renderBody={ (props) => renderDropdownBody(props) }
                    placement="bottom-start"
                    renderTarget={ (props: IDropdownToggler) => <LinkButton caption="Click to open" size="36" { ...props } /> }
                    value={ value }
                    onValueChange={ onValueChange }
                />
            </FlexRow>
        </div>

    );
}
