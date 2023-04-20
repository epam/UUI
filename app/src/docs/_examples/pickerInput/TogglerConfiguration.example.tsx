import React, { useState, useCallback } from 'react';
import { FlexCell, PickerInput, Button, FlexRow, TextInput } from '@epam/promo';
import { LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { City } from '@epam/uui-docs';
import css from './TogglerConfiguration.scss';

export default function PickerTogglerConfigurationExample() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<string[]>(['225284', '2747351', '3119841', '3119746']);

    const loadCities = useCallback((request: LazyDataSourceApiRequest<City, string>) => {
        return svc.api.demo.cities(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadCities }, []);

    return (
        <FlexCell width={300} cx={css.container}>
            <PickerInput dataSource={dataSource} value={value} onValueChange={onValueChange} entityName="city" selectionMode="multi" valueType="id" maxItems={3} />

            <PickerInput dataSource={dataSource} value={value} onValueChange={onValueChange} entityName="city" selectionMode="multi" valueType="id" isSingleLine={true} />

            <PickerInput
                dataSource={dataSource}
                value={value}
                onValueChange={onValueChange}
                entityName="city"
                selectionMode="multi"
                minCharsToSearch={3}
                searchPosition="input"
                placeholder="Start type city name for search"
                valueType="id"
            />

            <FlexRow>
                <PickerInput
                    dataSource={dataSource}
                    value={value}
                    onValueChange={onValueChange}
                    entityName="city"
                    selectionMode="multi"
                    valueType="id"
                    searchPosition="input"
                    renderToggler={(props) => <TextInput {...props} value={props.value ?? ''} onValueChange={(e) => props.onValueChange?.(e)} />}
                />
            </FlexRow>
        </FlexCell>
    );
}
