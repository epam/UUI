import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ModalHeader, ModalHeaderProps } from '@epam/loveship';
import { DefaultContext } from '../../docs';
import { FlexRow } from '@epam/loveship';
import { Text } from '@epam/loveship';
import { Button } from '@epam/loveship';

const ModalHeaderDoc = new DocBuilder<ModalHeaderProps>({ name: 'ModalHeader', component: ModalHeader })
    .prop('title', {
        examples: ['Text', { value: 'Very long text', isDefault: true }],
        type: 'string',
    })
    .prop('background', { examples: ['white', 'night50', 'none'] })
    .prop('borderBottom', { examples: [true, false], defaultValue: false })
    .prop('padding', { examples: ['6', '12', '24'] })
    .prop('onClose', { examples: (ctx) => [ctx.getCallback('onClose')] })
    .prop('children', {
        examples: [
            {
                value: (
                    <React.Fragment>
                        <FlexRow padding="24" vPadding="12">
                            <FlexRow>
                                <Text size="30" font="sans">
                                    Modal header text in children props
                                </Text>
                            </FlexRow>
                            <FlexRow>
                                <Button onClick={() => {}} color="grass" caption="Ok" />
                                <Button onClick={() => {}} fill="none" color="night600" caption="Cancel" />
                            </FlexRow>
                        </FlexRow>
                    </React.Fragment>
                ),
                name: 'Base',
            },
        ],
    })
    .withContexts(DefaultContext);

export default ModalHeaderDoc;
