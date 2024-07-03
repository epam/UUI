import * as React from 'react';
import {
    IPropDocEditor,
    PropDoc,
    SharedPropEditorsMap,
    TPropDocEditorType,
} from '@epam/uui-docs';
import { FlexCell, FlexRow, FlexSpacer, IconButton, Tooltip } from '@epam/uui';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-info-outline-18.svg';

interface IPeTableCellProps<TProps> extends IPropDocEditor<TProps[keyof TProps]> {
    prop: PropDoc<TProps, keyof TProps>;
}
export function PeTableCell<TProps>(props: IPeTableCellProps<TProps>): React.ReactElement {
    const { name, value, onValueChange, exampleId, onExampleIdChange, examples } = props;
    const { editorType, description } = props.prop;

    let PE: TPropDocEditorType = editorType;
    if (!PE) {
        const numExamples = examples.length;
        if (numExamples > 1) {
            PE = 'MultiUnknownEditor';
        } else if (numExamples === 1) {
            PE = 'SingleUnknownEditor';
        }
    }

    if (PE) {
        const peProps: IPropDocEditor<TProps[keyof TProps]> = {
            name,
            value,
            exampleId,
            examples,
            onValueChange,
            onExampleIdChange,
        };
        const Component = typeof PE === 'string' ? SharedPropEditorsMap[PE] : PE;
        return (
            <FlexRow size="24" columnGap="6" rawProps={ { style: { marginTop: '6px', marginBottom: '6px', flexWrap: 'wrap' } } }>
                <Component { ...peProps } />
                <FlexSpacer />
                {
                    description && (
                        <FlexCell shrink={ 1 } minWidth={ 24 }>
                            <Tooltip placement="top" content={ description }>
                                <IconButton icon={ InfoIcon } color="neutral" rawProps={ { style: { minWidth: '18px' } } } />
                            </Tooltip>
                        </FlexCell>
                    )
                }
            </FlexRow>
        );
    }
    return null;
}
