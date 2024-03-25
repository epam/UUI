import React, { useState } from 'react';
import { DataQueryFilter, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, FlexRow, LabeledInput, NumericInput, PickerInput, PickerTogglerTag } from '@epam/uui';
import { Location } from '@epam/uui-docs';
import { ReactComponent as myIcon } from '@epam/assets/icons/action-account-fill.svg';

const cascadeSelectionModes: Array<{ id: 'explicit' | 'implicit'; caption: string }> = [
    {
        id: 'explicit',
        caption: 'Explicit cascade selection',
    }, {
        id: 'implicit',
        caption: 'Implicit cascade selection',
    },
];

export function PickerTogglerTagDemo() {
    const svc = useUuiContext();
    const [maxItems, setMaxItems] = useState(null);
    const [value, onValueChange] = useState<string[]>();
    const [cascadeSelection] = useState(cascadeSelectionModes[0].id);

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                // and since parentId is meaningful value, it is required to exclude it from the filter.
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );

    return (
        <FlexCell width={ 370 }>
            <FlexRow margin="12">
                <LabeledInput label="Set maxItem">
                    <NumericInput value={ maxItems } onValueChange={ setMaxItems } />
                </LabeledInput>
            </FlexRow>
            <FlexRow margin="12">
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    entityName="location"
                    selectionMode="multi"
                    valueType="id"
                    cascadeSelection={ cascadeSelection }
                    maxItems={ maxItems }
                    renderTag={ (props) => {
                        return (
                            <PickerTogglerTag
                                { ...props }
                                key={ props.isCollapsed ? 'collapsed' : props.rowProps?.id as string }
                                tooltipContent={ !props.isCollapsed && `${props.rowProps?.path.map((i) => i.value.name).join('/')}/${props.caption}` }
                                icon={ !props.isCollapsed && myIcon }
                            />
                        );

                        // if (props.isCollapsed) {
                        //     return (
                        //         <Button
                        //             { ...props }
                        //             size="30"
                        //             key="collapsed"
                        //             color="secondary"
                        //         />
                        //     );
                        // } else {
                        //     return (
                        //         <Tooltip content={ `${props.rowProps?.path.map((i) => i.value.name).join('/')}/${props.caption}` }>
                        //             <Button
                        //                 { ...props }
                        //                 size="30"
                        //                 key={ props.rowProps?.id as string }
                        //                 color="accent"
                        //                 icon={ myIcon }
                        //             />
                        //         </Tooltip>
                        //     );
                        // }
                    } }
                />
            </FlexRow>
        </FlexCell>
    );
}
