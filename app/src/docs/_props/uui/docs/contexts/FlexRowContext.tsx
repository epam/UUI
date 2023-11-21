import * as React from 'react';
import css from './FlexRowContext.module.scss';
import { DemoComponentProps } from '@epam/uui-docs';
import { FlexRow, FlexCell, TextInput } from '@epam/uui';

function FlexRowContext({ DemoComponent, props }: DemoComponentProps) {
    return (
        <FlexRow cx={ css.root } spacing="18">
            <FlexCell width={ 150 } grow={ 1 }>
                <TextInput value={ null } onValueChange={ null } placeholder="Placeholder" />
            </FlexCell>
            <DemoComponent { ...props } />
        </FlexRow>
    );
}
FlexRowContext.displayName = 'FlexRowContext';

export { FlexRowContext };
