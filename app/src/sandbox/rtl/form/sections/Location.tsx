import { ILens, useAsyncDataSource, useLazyDataSource, UuiContexts, useUuiContext } from '@epam/uui-core';
import { Country } from '@epam/uui-docs';
import { FlexCell, FlexRow, LabeledInput, PickerInput, RichTextView, Switch } from '@epam/uui';
import { PersonLocation } from '../types';
import { TApi } from '../../../../data';
import css from '../DemoForm.module.scss';
import * as React from 'react';
import { useState } from 'react';
import { IDir } from '../DemoForm';

export function LocationSection({ lens, dir }: { lens: ILens<PersonLocation>, dir: IDir }) {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [value, setValue] = useState(false);

    const citiesDataSource = useLazyDataSource(
        {
            api: svc.api.demo.cities,
        },
        [],
    );

    const countriesDS = useAsyncDataSource<Country, string, unknown>(
        {
            api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then((r) => r.items),
        },
        [],
    );

    return (
        <>
            <RichTextView>
                <h3>Location</h3>
            </RichTextView>

            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="country" label="Country" { ...lens.prop('country').toProps() }>
                        <PickerInput
                            { ...lens.prop('country').toProps() }
                            dataSource={ countriesDS }
                            selectionMode="single"
                            valueType="id"
                            id="country"
                            placeholder="Select Country"
                            onValueChange={ (inputValue) => lens.set({ country: inputValue as string, city: null }) }
                            rawProps={ { body: { dir: dir } } }
                        />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="city" label="City" { ...lens.prop('city').toProps() }>
                        <PickerInput
                            { ...lens.prop('city').toProps() }
                            selectionMode="single"
                            valueType="id"
                            id="city"
                            dataSource={ citiesDataSource }
                            filter={ { country: lens.prop('country').get() } }
                            placeholder="Select City"
                            rawProps={ { body: { dir: dir } } }
                        />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 324 } alignSelf="flex-end">
                    <FlexRow size="36" columnGap="18" alignItems="center">
                        <Switch label="Time Reporting" value={ value } onValueChange={ setValue } />
                        <Switch label="Remote" value={ value } onValueChange={ setValue } />
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        </>
    );
}
