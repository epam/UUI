import * as React from 'react';
import { Button, MultiSwitch, Tooltip } from '@epam/uui';
import { isPropValueEmpty, stringifyUnknown } from '../utils/propEditorUtils';
import { IPropDocEditor } from '../../../types';

export function MultiUnknownExamples(props: IPropDocEditor) {
    return <MultiUnknownExamplesBase propDeProps={ props } isValueNodeVisible={ true } isVerticalItems={ false } />;
}
export function withMultiUnknownExamplesComponent(params: IMultiUnknownExamplesCustomization) {
    return function WithMultiUnknownExamplesComponent(props: IPropDocEditor) {
        return <MultiUnknownExamplesBase propDeProps={ props } { ...params } />;
    };
}

interface IMultiUnknownExamplesCustomization {
    isValueNodeVisible: boolean,
    isVerticalItems: boolean
}

function MultiUnknownExamplesBase(props: { propDeProps: IPropDocEditor } & IMultiUnknownExamplesCustomization) {
    const { value, examples, exampleId, onExampleIdChange } = props.propDeProps;
    const items = examples.map((example) => ({
        caption: example.name,
        id: example.id,
    }));

    let valueNode: React.ReactNode = null;
    if (props.isValueNodeVisible && exampleId === undefined && !isPropValueEmpty(value)) {
        const str = stringifyUnknown(value);
        valueNode = (
            <Tooltip content={ <pre style={ { fontSize: '10pt', lineHeight: 1 } }>{str}</pre> }>
                <Button
                    fill="solid"
                    size="24"
                    caption={ str }
                    rawProps={ { style: { wordBreak: 'break-word', minWidth: '70px' } } }
                />
            </Tooltip>
        );
    }

    return (
        <React.Fragment>
            { valueNode }
            <MultiSwitch
                items={ items }
                onValueChange={ onExampleIdChange }
                value={ exampleId }
                size="24"
                rawProps={ { style: { flexWrap: 'wrap', ...(props.isVerticalItems ? { flexDirection: 'column' } : {}) } } }
            />
        </React.Fragment>
    );
}
