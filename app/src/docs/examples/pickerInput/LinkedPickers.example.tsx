import React, { useState } from "react";
import { City, Country } from "@epam/uui-docs";
import { AsyncDataSource, LazyDataSource, useUuiContext} from "@epam/uui";
import { FlexCell, LabeledInput, PickerInput } from "@epam/promo";

export default function ArrayLinkedPickers() {
    const svc = useUuiContext();
    const [country, setCountry] = useState<Country>(null);
    const [cities, setCities] = useState<string[]>(null);

    const countryDataSource = new AsyncDataSource({
        api: () => svc.api.demo.countries({}).then((r: any) => r.items),
    });

    const citiesDataSource = new LazyDataSource({
        api: (req) => svc.api.demo.cities(req),
    });

    return (
        <FlexCell width={ 300 }>
            <LabeledInput label='Select country'>
                <PickerInput<Country, string>
                    dataSource={ countryDataSource }
                    value={ country }
                    onValueChange={ setCountry }
                    entityName='Country'
                    selectionMode='single'
                    valueType='entity'
                />
            </LabeledInput>

            <LabeledInput label={ country ? `Select city from ${country.name}` : 'Select city' }>
                <PickerInput<City, string>
                    dataSource={ citiesDataSource }
                    value={ cities }
                    onValueChange={ setCities }
                    isDisabled={ !country }
                    entityName='City'
                    selectionMode='multi'
                    valueType='id'
                    filter={ { country: country.id } } // Your filter object, which will be send to the server
                />
            </LabeledInput>
        </FlexCell>
    );
}