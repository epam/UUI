import React from 'react';
import { Button } from '@epam/uui';

import { useEffect, useState } from 'react';
import { FlexRow, FlexCell, PickerInput } from '@epam/uui';
import { LazyDataSourceApiResponse, useArrayDataSource } from '@epam/uui-core';

type TItem = { id: string; name: string; extraData?: string };

const DEFAULT_VALUE: TItem = { id: 'id_5', name: 'Name 5' };

export default function MainPage() {
    const [log, setLog] = useState<string[]>(() => []);
    const [value, setValue] = useState<TItem>(() => DEFAULT_VALUE);
    const [items, setItems] = useState<TItem[]>(() => []);
    const isLoading = !items.length;
    useEffect(() => {
        loadItems().then((res) => setItems(res.items));
    }, []);
    const ds = useArrayDataSource({ items }, [items]);

    if (isLoading) {
        return null; // <--- NOTE: bug is only reproduced when this condition is present
    }

    const handleValueChange = (newValue?: TItem) => {
        setLog((prev) => {
            return prev.concat(
                `onValueChange invoked!!!! currenValue=${JSON.stringify(value)} newValue = ${JSON.stringify(newValue)}`,
            );
        });
        setValue(newValue);
    };

    return (
        <FlexCell width={ 612 }>
            <FlexRow columnGap="12">
                <PickerInput
                    dataSource={ ds }
                    selectionMode="single"
                    valueType="entity"
                    value={ value }
                    onValueChange={ handleValueChange }
                />
                <Button
                    caption="set another value"
                    onClick={ () => {
                        setValue({ id: 'id_7', name: 'Name 7', bb: 111 } as any);
                    } }
                />
            </FlexRow>
            <FlexRow columnGap="12">
                <ul>
                    {log.map((msg, i) => {
                        return <li key={ i }>{msg}</li>;
                    })}
                </ul>
            </FlexRow>
        </FlexCell>
    );
}

function loadItems(): Promise<LazyDataSourceApiResponse<TItem>> {
    const items = new Array(20).fill(null).map((_, index) => ({
        id: `id_${index}`,
        name: `Name ${index}`,
        extraData: 'bla-bla',
    }));
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                items,
            });
        }, 300);
    });
}

/* export default function BasicExample() {
    return (
        <div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
            <Button color="primary" caption="Primary Action" onClick={ () => null } />
            <Button color="accent" caption="Call to action" onClick={ () => null } />
            <Button color="critical" caption="Critical Action" onClick={ () => null } />
        </div>
    );
} */
