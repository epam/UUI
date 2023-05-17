import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ModalFooter, FlexRow, Text, Button } from '@epam/loveship';
import { ModalFooterProps } from '@epam/uui';
import { DefaultContext } from '../../docs';

const ModalFooterDoc = new DocBuilder<ModalFooterProps>({ name: 'ModalFooter', component: ModalFooter })
    .prop('borderTop', { examples: [true] })
    .prop('padding', {
        examples: [
            '6', '12', '24',
        ],
    })
    .prop('children', {
        examples: [
            {
                isDefault: true,
                value: (
                    <FlexRow vPadding="12">
                        <FlexRow>
                            <Text size="30" font="sans">
                                Modal footer text in children props
                            </Text>
                        </FlexRow>
                        <FlexRow>
                            <Button onClick={ () => {} } color="grass" caption="Ok" />
                            <Button onClick={ () => {} } fill="none" color="night500" caption="Cancel" />
                        </FlexRow>
                    </FlexRow>
                ),
                name: 'Caption with buttons',
            },
        ],
    })
    .withContexts(DefaultContext);

export default ModalFooterDoc;
