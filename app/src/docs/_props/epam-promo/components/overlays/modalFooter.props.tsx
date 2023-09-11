import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ModalFooter } from '@epam/promo';
import { ModalFooterProps } from '@epam/uui';
import { DefaultContext } from '../../docs';
import { FlexRow } from '@epam/promo';
import { Text } from '@epam/promo';
import { Button } from '@epam/promo';

const ModalFooterDoc = new DocBuilder<ModalFooterProps>({ name: 'ModalFooter', component: ModalFooter })
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
                    <FlexRow vPadding="12" spacing="6">
                        <FlexRow>
                            <Text size="30" font="sans">
                                Modal footer text in children props
                            </Text>
                        </FlexRow>
                        <FlexRow spacing="6">
                            <Button onClick={ () => {} } color="green" caption="Ok" />
                            <Button onClick={ () => {} } fill="none" color="gray" caption="Cancel" />
                        </FlexRow>
                    </FlexRow>
                ),
                name: 'Caption with buttons',
            },
        ],
    })
    .withContexts(DefaultContext);

export default ModalFooterDoc;
