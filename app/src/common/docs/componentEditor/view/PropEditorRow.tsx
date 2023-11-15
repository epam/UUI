import * as React from 'react';
import { IPropSamplesCreationContext, PropDoc } from '@epam/uui-docs';
import { getExamplesList, isPropValueEmpty } from '../utils';
import { FlexCell, FlexRow, RadioInput, Text } from '@epam/uui';
import { PropEditorCell } from './PropEditorCell';

interface IPropEditorRow {
    prop: PropDoc<any, string | number | symbol>;
    propValue: any;
    propExampleId: string;
    onResetProp: (propName: string) => void;
    propContext: IPropSamplesCreationContext;
    onPropValueChange: (params: { prop: PropDoc<any, any>, newPropValue: any }) => void;
    onPropExampleIdChange: (params: { prop: PropDoc<any, any>, newPropExampleId: string }) => void;
}

export const PropEditorRow = React.memo(function PropEditorRowComponent(props: IPropEditorRow) {
    const { prop, onResetProp, propContext, propExampleId, propValue, onPropValueChange, onPropExampleIdChange } = props;
    const isNothingSelected = !prop.isRequired && !propExampleId && isPropValueEmpty(propValue);
    const propExamplesList = getExamplesList(prop.examples, propContext);
    const isNone = isPropValueEmpty(prop.defaultValue);

    return (
        <FlexRow size="36" borderBottom padding="12" spacing="6">
            <FlexCell key="name" width={ 130 }>
                <Text>{prop.name}</Text>
            </FlexCell>
            <FlexCell key="default" width={ 110 }>
                {!prop.isRequired && (
                    <RadioInput
                        label={ isNone ? 'none' : prop.defaultValue + '' }
                        size="18"
                        value={ isNothingSelected }
                        onValueChange={ () => onResetProp(prop.name) }
                    />
                )}
            </FlexCell>
            <FlexCell key="examples" grow={ 1 }>
                <FlexRow size="36" spacing="6">
                    <PropEditorCell
                        prop={ prop }
                        propValue={ propValue }
                        propExampleId={ propExampleId }
                        propExamplesList={ propExamplesList }
                        onPropValueChange={ (newPropValue) => onPropValueChange({ prop, newPropValue }) }
                        onPropExampleIdChange={ (newPropExampleId) => onPropExampleIdChange({ prop, newPropExampleId }) }
                    />
                </FlexRow>
            </FlexCell>
        </FlexRow>
    );
});
