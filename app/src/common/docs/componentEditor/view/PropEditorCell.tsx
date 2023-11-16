import * as React from 'react';
import {
    PropDoc,
    SharedPropEditorsMap,
    ISharedPropEditor, TEditorType, PropExampleObject,
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

    let re: TEditorType<any, any> = editorType;
    if (!re) {
        const numExamples = propExamplesList.length;
        if (numExamples > 1) {
            re = 'MultiUnknownEditor';
        } else if (numExamples === 1) {
            re = 'SingleUnknownEditor';
        }
    }

    if (re) {
        const descriptionNode = <PropDescription description={ description } />;
        if (typeof re === 'string') {
            /*  Preferable approach */
            const SharedPeComponent = SharedPropEditorsMap[re];
            const peProps: ISharedPropEditor = {
                name,
                value: propValue,
                exampleId: propExampleId,
                examples: propExamplesList,
                onValueChange: onPropValueChange,
                onExampleIdChange: onPropExampleIdChange,
            };
            return (
                <>
                    <SharedPeComponent { ...peProps } />
                    { descriptionNode }
                </>
            );
        } else {
            /* Old approach */
            const node = re({ value: propValue, onValueChange: onPropValueChange }, propExamplesList?.map((ex) => ex.value));
            return (
                <>
                    { node }
                    { descriptionNode }
                </>
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
