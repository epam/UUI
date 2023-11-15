import * as React from 'react';
import css from './FlexRowContext.module.scss';
import { DemoComponentProps } from '@epam/uui-docs';
import { FlexRow, FlexCell, TextInput } from '@epam/loveship';

export class FlexRowContext extends React.Component<DemoComponentProps> {
    public static displayName = 'FlexRowContext';
    render() {
        const { DemoComponent, props } = this.props;

        return (
            <FlexRow cx={ css.root } background="white" spacing="18">
                <FlexCell width={ 150 } grow={ 1 }>
                    <TextInput value={ null } onValueChange={ null } placeholder="Placeholder" />
                </FlexCell>
                <DemoComponent { ...props } />
            </FlexRow>
        );
    }
}
