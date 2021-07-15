import React, { useState } from "react";
import { Product } from "@epam/uui-docs";
import { AsyncDataSource, useUuiContext } from "@epam/uui";
import { FlexCell, FlexRow, PickerInput } from "@epam/promo";

export default function GetRowOptionsExample() {
    const svc = useUuiContext();
    const [productID, setProductID] = useState<number>(null);
    const [productsIDs, setProductsIDs] = useState<number[]>(null);

    const productsDataSource = new AsyncDataSource({
        api: () => svc.api.demo.products({}).then((r: any) => r.items),
        getId: item => item.ProductID,
    });

    return (
        <FlexCell width={ 600 }>
            <FlexRow spacing='12' >
                <PickerInput<Product, number>
                    dataSource={ productsDataSource }
                    value={ productID }
                    onValueChange={ setProductID }
                    getRowOptions={ item => ({
                        isDisabled: item.MakeFlag === true,
                        isSelectable: item.MakeFlag !== true,
                    }) }
                    getName={ item => item.Name }
                    entityName='Product'
                    selectionMode='single'
                    valueType='id'
                />
                <PickerInput<Product, number>
                    dataSource={ productsDataSource }
                    value={ productsIDs }
                    onValueChange={ setProductsIDs }
                    getRowOptions={ item => ({
                        isDisabled: item.MakeFlag === true,
                        checkbox: {
                            isDisabled: item.MakeFlag === true,
                            isVisible: true,
                        },
                    }) }
                    getName={ item => item.Name }
                    entityName='Product'
                    selectionMode='multi'
                    valueType='id'
                />
            </FlexRow>
        </FlexCell>
    );
}