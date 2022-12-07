import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DropdownProps, Dropdown } from '@epam/uui-components';
import { Button, Panel, FlexRow, Text } from '../../../components';
import { DefaultContext } from '../../../docs';

const dropdownMenuDoc = new DocBuilder<DropdownProps>({ name: 'Dropdown', component: Dropdown })
    .prop('renderBody', { isRequired: true, examples: [{
        value:
            () => {
                return (
                    <Panel background='white' shadow={ true }>
                        <FlexRow padding='12' vPadding='12'>
                            <Text>
                                Dropdown body content.
                                You can use any components as a dropdown body.
                            </Text>
                        </FlexRow>
                    </Panel>
                );
            }
        ,
        isDefault: true,
    }] })
    .prop('renderTarget', { isRequired: true, examples: [{
        value: props => <Button caption='Target' { ...props }/>,
        isDefault: true,
    }] })
    .prop('openOnClick', {
        examples: [true],
    })
    .prop('openOnHover', {
        examples: [{ value: true }],
    })
    .prop('closeOnClickOutside', {
        examples: [true],
    })
    .prop('closeOnTargetClick', {
        examples: [true],
    })
    .prop('closeOnMouseLeave', {
        examples: ['toggler', 'boundary', false],
    })
    .withContexts(DefaultContext);

export default dropdownMenuDoc;
