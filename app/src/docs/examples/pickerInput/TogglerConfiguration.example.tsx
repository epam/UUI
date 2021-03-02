import React, { useState, useCallback } from 'react';
import {FlexCell, PickerInput, Button, FlexRow, PickerToggler, Badge} from '@epam/promo';
import {LazyDataSourceApiRequest, useLazyDataSource} from '@epam/uui';
import { svc } from "../../../services";
import { City } from '@epam/uui-docs';
import * as css from './TogglerConfiguration.example.scss';

export function PickerTogglerConfigurationExample() {
    const [value, onValueChange] = useState<string[]>(["225284", "2747351", "3119841", "3119746"]);

    const loadCities = useCallback((request: LazyDataSourceApiRequest<City, string>) => {
        return svc.api.demo.cities(request);
    }, []);

    const dataSource = useLazyDataSource({
        api: loadCities,
    });

    return (
        <FlexCell width={ 460 } cx={ css.container }>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='city'
                selectionMode='multi'
                valueType='id'
                maxItems={ 3 }
            />

            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='city'
                selectionMode='multi'
                valueType='id'
                isSingleLine={ true }
            />

            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='city'
                selectionMode='multi'
                minCharsToSearch={ 3 }
                searchPosition='input'
                placeholder='Start type city name for search'
                valueType='id'
            />

            <FlexRow>
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    entityName='city'
                    selectionMode='multi'
                    valueType='id'
                    renderToggler={ (props) => <Button { ...props } /> }
                />
            </FlexRow>
        </FlexCell>
    );
}
