import * as React from 'react';
import {
    PropDoc,
    SharedPropEditorsMap,
    IPropDocEditor, TEditorType, PropExampleObject,
} from '@epam/uui-docs';
import { IconButton, Tooltip } from '@epam/uui';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-fill-18.svg';

interface IPropEditorCell<TProp> {
    prop: PropDoc<any, any>;
    propValue: TProp;
    propExampleId: string | undefined;
    propExamplesList: PropExampleObject<TProp>[];
    onPropValueChange: (newPropValue: TProp) => void;
    onPropExampleIdChange: (newPropExampleId: string) => void;
}
export function PropEditorCell<TProp = any>(props: IPropEditorCell<TProp>): React.ReactElement {
    const { propValue, propExampleId, propExamplesList, onPropValueChange, onPropExampleIdChange } = props;
    const { editorType, name, description } = props.prop;

    let PE: TEditorType = editorType;
    if (!PE) {
        const numExamples = propExamplesList.length;
        if (numExamples > 1) {
            PE = 'MultiUnknownEditor';
        } else if (numExamples === 1) {
            PE = 'SingleUnknownEditor';
        }
    }

    if (PE) {
        const descriptionNode = <PropDescription description={ description } />;
        const peProps: IPropDocEditor = {
            name,
            value: propValue,
            exampleId: propExampleId,
            examples: propExamplesList,
            onValueChange: onPropValueChange,
            onExampleIdChange: onPropExampleIdChange,
        };
        if (typeof PE === 'string') {
            /*  Preferable approach */
            const SharedPeComponent = SharedPropEditorsMap[PE];

            return (
                <>
                    <SharedPeComponent { ...peProps } />
                    { descriptionNode }
                </>
            );
        } else {
            return (
                <PE { ...peProps } />
            );
        }
    }

    return null;
}

function PropDescription(props: { description: string }) {
    if (props.description) {
        return (
            <Tooltip placement="top" content={ props.description }>
                <IconButton icon={ InfoIcon } color="neutral" rawProps={ { style: { minWidth: '18px' } } } />
            </Tooltip>
        );
    }
    return null;
}
