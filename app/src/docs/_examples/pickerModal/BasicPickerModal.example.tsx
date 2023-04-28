import React, { useCallback, useContext, useState } from 'react';
import { DataPickerRow, PickerItem, PickerModal } from '@epam/uui';
import { FlexRow, FlexCell, Button } from '@epam/promo';
import { DataRowProps, UuiContext, useArrayDataSource } from '@epam/uui-core';

interface Language {
    id: number;
    level: string;
}

const languageLevels: Language[] = [
    { id: 2, level: 'A1' },
    { id: 3, level: 'A1+' },
    { id: 4, level: 'A2' },
    { id: 5, level: 'A2+' },
    { id: 6, level: 'B1' },
    { id: 7, level: 'B1+' },
    { id: 8, level: 'B2' },
    { id: 9, level: 'B2+' },
    { id: 10, level: 'C1' },
    { id: 11, level: 'C1+' },
    { id: 12, level: 'C2' },
];

export default function LanguagesPickerModal() {
    const [value, onValueChange] = useState<number>(8);
    const context = useContext(UuiContext);
    // Create DataSource outside the Picker, by calling useArrayDataSource hook
    const dataSource = useArrayDataSource<Language, number, any>(
        {
            items: languageLevels,
        },
        [],
    );

    const renderRow = (rowProps: DataRowProps<Language, number>) => (
        <DataPickerRow
            { ...rowProps }
            key={ rowProps.rowKey }
            borderBottom="none"
            size="36"
            padding="24"
            renderItem={ (item: Language, pickerItemProps: DataRowProps<Language, number>) => (
                <PickerItem title={ item.level } size="36" { ...pickerItemProps } />
            ) }
        />
    );

    const handleModalOpening = useCallback(() => {
        context.uuiModals
            .show<number>(
            (props) => {
                return (
                    <PickerModal
                        initialValue={ value }
                        dataSource={ dataSource }
                        selectionMode="single"
                        valueType="id"
                        renderRow={ renderRow }
                        { ...props }
                    />
                );
            },
        )
            .then((newSelection) => {
                onValueChange(newSelection);
            })
            .catch(() => {});
    }, [context.uuiModals, dataSource, value]);

    return (
        <FlexCell width={ 612 }>
            <FlexRow spacing="12">
                <Button color="blue" caption="Show languages" onClick={ handleModalOpening } />
            </FlexRow>
        </FlexCell>
    );
}
