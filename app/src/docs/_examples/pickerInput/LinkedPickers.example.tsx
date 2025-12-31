import React, { useState } from 'react';
import { City, Country } from '@epam/uui-docs';
import { useAsyncDataSource, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, LabeledInput, PickerInput } from '@epam/uui';

export default function ArrayLinkedPickers() {
    const svc = useUuiContext();
    const [country, setCountry] = useState<Country>(null);
    const [cities, setCities] = useState<string[]>(null);

    const countryDataSource = useAsyncDataSource<Country, string, unknown>(
        {
            api: (options) => svc.api.demo.countries({}, options).then((r: any) => r.items),
        },
        [],
    );

    const citiesDataSource = useLazyDataSource<City, string, unknown>(
        {
            api: svc.api.demo.cities,
        },
        [],
    );

    return (
        <FlexCell width={ 300 }>
            <LabeledInput label="Select country">
                <PickerInput<Country, string>
                    dataSource={ countryDataSource }
                    value={ country }
                    onValueChange={ setCountry }
                    entityName="Country"
                    selectionMode="single"
                    valueType="entity"
                />
            </LabeledInput>

            <LabeledInput label={ country ? `Select city from ${country.name}` : 'Select city' }>
                <PickerInput<City, string>
                    dataSource={ citiesDataSource }
                    value={ cities }
                    onValueChange={ setCities }
                    isDisabled={ !country }
                    entityName="City"
                    selectionMode="multi"
                    valueType="id"
                    maxItems={ 3 }
                    filter={ { country: country?.id } } // Your filter object, which will be send to the server
                />
            </LabeledInput>
        </FlexCell>
    );
}
