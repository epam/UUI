import React, { useState } from 'react';
import { Location, Product } from '@epam/uui-docs';
import { useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, FlexRow, PickerInput } from '@epam/uui';
import { TApi } from '../../../data';

export default function GetRowOptionsExample() {
    const svc = useUuiContext<TApi>();
    const [location, setLocation] = useState<string>();
    const [productsIDs, setProductsIDs] = useState<number[]>([3, 4]);

    const productsDataSource = useAsyncDataSource<Product, Product['ProductID'], unknown>({
        api: (options) => svc.api.demo.products(options).then((r: any) => r.items),
        getId: (item) => item.ProductID,
    }, []);

    const locationsDataSource = useAsyncDataSource<Location, string, unknown>(
        {
            api: (options) => svc.api.demo.locations(options).then(({ items }) => items),
            getId: (item) => item.id,
        },
        [],
    );

    return (
        <FlexCell width={ 612 }>
            <FlexRow columnGap="12">
                <PickerInput<Location, string>
                    dataSource={ locationsDataSource }
                    value={ location }
                    onValueChange={ setLocation }
                    getRowOptions={ (item) => ({
                        isDisabled: !item?.parentId,
                        isSelectable: !!item?.parentId,
                    }) }
                    getName={ (item) => item.name }
                    entityName="Location"
                    selectionMode="single"
                    valueType="id"
                />
                <PickerInput<Product, number>
                    dataSource={ productsDataSource }
                    value={ productsIDs }
                    onValueChange={ setProductsIDs }
                    getRowOptions={ (item) => ({
                        isDisabled: item.MakeFlag,
                        checkbox: {
                            isDisabled: item.MakeFlag,
                            isVisible: true,
                        },
                    }) }
                    getName={ (item) => item.Name }
                    entityName="Product"
                    selectionMode="multi"
                    valueType="id"
                    maxItems={ 3 }
                />
            </FlexRow>
        </FlexCell>
    );
}
