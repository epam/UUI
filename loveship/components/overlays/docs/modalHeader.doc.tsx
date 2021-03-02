import * as React from 'react';
import { DocBuilder, PropSamplesCreationContext } from '@epam/uui-docs';
import { ModalHeader, ModalHeaderProps } from '../Modals';
import { DefaultContext} from '../../../docs';
import { FlexRow } from '../../layout';
import { Text } from '../../typography';
import { Button } from '../../../components';

const ModalHeaderDoc = new DocBuilder<ModalHeaderProps>({ name: 'ModalHeader', component: ModalHeader })
    .prop('title', {
        examples: ['Text', {value: 'Very long text', isDefault: true}], type: 'string',
    })
    .prop('background', { examples: ['white', 'night50', 'none'] })
    .prop('borderBottom', { examples: [true, 'night50', 'night400'], defaultValue: 'night400' })
    .prop('padding', { examples: ['6', '12', '24'] })
    .prop('onClose', { examples: (ctx: PropSamplesCreationContext) => [ctx.getCallback('onClose')] })
    .prop('children', {
        examples: [
            {
                value: <React.Fragment>
                <FlexRow padding='24' vPadding='12'>
                    <FlexRow>
                        <Text size="30" font='sans'>Modal header text in children props</Text>
                    </FlexRow>
                    <FlexRow>
                        <Button onClick={ () => {} } color='grass' caption='Ok'/>
                        <Button onClick={ () => {} } fill='none' color='carbon' caption='Cancel'/>
                    </FlexRow>
                </FlexRow>
                </React.Fragment>, name: 'Base',
            },
        ],
    })
    .withContexts(DefaultContext);

export = ModalHeaderDoc;