import * as React from 'react';
import { FlexCell, FlexRow, RadioInput, Text } from '@epam/uui';
import { IPeTableRowProps } from './types';
import { PeTableCell } from './PeTableCell';
import { buildExamplesList } from '../../propDocUtils';

export const PeTableRow = React.memo(PropEditorRowComponent) as typeof PropEditorRowComponent;

function PropEditorRowComponent<TProps>(props: IPeTableRowProps<TProps>) {
    const { prop, onClearProp, propContext, exampleId, value, onValueChange, onExampleIdChange } = props;
    const isNothingSelected = !prop.isRequired && !exampleId && value === undefined;
    const propExamplesList = buildExamplesList<TProps>({ prop, ctx: propContext });
    const isNone = prop.defaultValue === undefined;
    const name = prop.name;

    return (
        <FlexRow size="36" borderBottom padding="12" columnGap="6">
            <FlexCell key="name" width={ 130 }>
                <Text>{name}</Text>
            </FlexCell>
            <FlexCell key="default" width={ 110 }>
                {!prop.isRequired && (
                    <RadioInput
                        name={ prop.name }
                        label={ isNone ? 'none' : String(prop.defaultValue) }
                        value={ isNothingSelected }
                        onValueChange={ () => onClearProp(prop.name) }
                    />
                )}
            </FlexCell>
            <FlexCell key="examples" grow={ 1 }>
                <PeTableCell<TProps>
                    prop={ prop }
                    name={ name }
                    value={ value }
                    exampleId={ exampleId }
                    examples={ propExamplesList }
                    onValueChange={ (newValue) => onValueChange({ prop, newValue }) }
                    onExampleIdChange={ (newExampleId) => onExampleIdChange({ prop, newExampleId }) }
                />
            </FlexCell>
        </FlexRow>
    );
}
