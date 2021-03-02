import { Product } from "@epam/uui-docs";
import * as React from "react";
import { AsyncDataSource } from "@epam/uui";
import { svc } from "../../../services";
import { FlexCell, FlexRow, PickerInput } from "@epam/promo";

interface AsyncPickerInputState {
    productID: number;
    productsIds: number[];
}

export class GetRowOptionsExample extends React.Component<any, AsyncPickerInputState> {
    state: AsyncPickerInputState = {
        productID: null,
        productsIds: null,
    };

    productsDataSource = new AsyncDataSource({
        api: () => svc.api.demo.products({}).then(r => r.items),
        getId: item => item.ProductID,
    });

    render() {
        return (
            <FlexCell width={ 600 }>
                <FlexRow spacing='12' >
                    <PickerInput<Product, number>
                        dataSource={ this.productsDataSource }
                        value={ this.state.productID }
                        onValueChange={ (newVal: number) => this.setState({ productID: newVal }) }
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
                        dataSource={ this.productsDataSource }
                        value={ this.state.productsIds }
                        onValueChange={ newVal => this.setState({ productsIds: newVal }) }
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
}