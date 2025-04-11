import React, { useState, useCallback } from 'react';
import { FlexCell, PickerInput, SearchInput, FlexRow } from '@epam/uui';
import { LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { City } from '@epam/uui-docs';
import css from './TogglerConfiguration.module.scss';

export default function PickerTogglerConfigurationExample() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<string[]>(['625144', '703448', '756135', '2950159']);

    const loadCities = useCallback((request: LazyDataSourceApiRequest<City, string>) => {
        return svc.api.demo.cities(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadCities }, []);

    return (
        <FlexCell width={ 490 } cx={ css.container }>
            <PickerInput dataSource={ dataSource } value={ value } onValueChange={ onValueChange } entityName="city" selectionMode="multi" valueType="id" maxItems={ 3 } />

            <PickerInput dataSource={ dataSource } value={ value } onValueChange={ onValueChange } entityName="city" selectionMode="multi" valueType="id" isSingleLine={ true } />

            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName="city"
                selectionMode="multi"
                minCharsToSearch={ 3 }
                searchPosition="input"
                placeholder="Start type city name for search"
                valueType="id"
            />

            <FlexRow>
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    entityName="city"
                    selectionMode="multi"
                    valueType="id"
                    searchPosition="input"
                    renderToggler={ (props) => (
                        <SearchInput
                            { ...props }
                            key="toggler"
                            value={ props.value ?? '' }
                            onValueChange={ props.onValueChange }
                            placeholder="Custom toggler"
                        />
                    ) }
                />
            </FlexRow>
        </FlexCell>
    );
}
