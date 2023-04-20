import React, { useState } from 'react';
import { Product } from '@epam/uui-docs';
import { useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, FlexRow, PickerInput } from '@epam/promo';

export default function GetRowOptionsExample() {
    const svc = useUuiContext();
    const [productID, setProductID] = useState<number>(3);
    const [productsIDs, setProductsIDs] = useState<number[]>([3]);

    const productsDataSource = useAsyncDataSource<Product, Product['ProductID'], unknown>(
        {
            api: () => svc.api.demo.products({}).then((r: any) => r.items),
            getId: (item) => item.ProductID,
        },
        []
    );

    return (
        <FlexCell width={612}>
            <FlexRow spacing="12">
                <PickerInput<Product, number>
                    dataSource={productsDataSource}
                    value={productID}
                    onValueChange={setProductID}
                    getRowOptions={(item) => ({
                        isDisabled: item.MakeFlag === true,
                        isSelectable: item.MakeFlag !== true,
                    })}
                    getName={(item) => item.Name}
                    entityName="Product"
                    selectionMode="single"
                    valueType="id"
                />
                <PickerInput<Product, number>
                    dataSource={productsDataSource}
                    value={productsIDs}
                    onValueChange={setProductsIDs}
                    getRowOptions={(item) => ({
                        isDisabled: item.MakeFlag === true,
                        checkbox: {
                            isDisabled: item.MakeFlag === true,
                            isVisible: true,
                        },
                    })}
                    getName={(item) => item.Name}
                    entityName="Product"
                    selectionMode="multi"
                    valueType="id"
                />
            </FlexRow>
        </FlexCell>
    );
}
