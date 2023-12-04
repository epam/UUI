import * as React from 'react';
import { PropDoc, SharedPropEditorsMap, IPropDocEditor, TPropDocEditorType, PropExampleObject } from '@epam/uui-docs';
import { IconButton, Tooltip, FlexRow, FlexCell, FlexSpacer } from '@epam/uui';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-info-fill-18.svg';

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

    let PE: TPropDocEditorType = editorType;
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
        const Component = typeof PE === 'string' ? SharedPropEditorsMap[PE] : PE;
        return (
            <FlexRow size="24" spacing="6" rawProps={ { style: { marginTop: '6px', marginBottom: '6px', flexWrap: 'wrap' } } }>
                <Component { ...peProps } />
                <FlexSpacer />
                { descriptionNode }
            </FlexRow>
        );
    }

    return null;
}

function PropDescription(props: { description: string }) {
    if (props.description) {
        return (
            <FlexCell shrink={ 1 } minWidth={ 24 }>
                <Tooltip placement="top" content={ props.description }>
                    <IconButton icon={ InfoIcon } color="neutral" rawProps={ { style: { minWidth: '18px' } } } />
                </Tooltip>
            </FlexCell>
        );
    }
    return null;
}
