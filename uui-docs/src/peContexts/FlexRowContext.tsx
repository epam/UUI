import * as React from 'react';
import { FlexRow, FlexCell, TextInput } from '@epam/uui';
import css from './FlexRowContext.module.scss';
import { DemoComponentProps } from '../types';

function FlexRowContext({ DemoComponent, props }: DemoComponentProps) {
    return (
        <FlexRow cx={ css.root } columnGap="18">
            <FlexCell width={ 150 } grow={ 1 }>
                <TextInput value={ null } onValueChange={ null } placeholder="Placeholder" />
            </FlexCell>
            <DemoComponent { ...props } />
        </FlexRow>
    );
}
FlexRowContext.displayName = 'FlexRowContext';

export { FlexRowContext };
