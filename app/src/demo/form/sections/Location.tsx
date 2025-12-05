import { ILens, useAsyncDataSource, useLazyDataSource, UuiContexts, useUuiContext } from '@epam/uui-core';
import { Country } from '@epam/uui-docs';
import { FlexCell, FlexRow, LabeledInput, PickerInput, RichTextView } from '@epam/uui';
import { PersonLocation } from '../types';
import { TApi } from '../../../data';
import css from '../DemoForm.module.scss';
import * as React from 'react';

export function LocationSection({ lens }: { lens: ILens<PersonLocation>; }) {
    const svc = useUuiContext<TApi, UuiContexts>();

    const citiesDataSource = useLazyDataSource(
        {
            api: svc.api.demo.cities,
        },
        [],
    );

    const countriesDS = useAsyncDataSource<Country, string, unknown>(
        {
            api: (options) => svc.api.demo.countries({ sorting: [{ field: 'name' }] }, options)
                .then((r) => r.items),
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
                            onValueChange={ (value) => lens.set({ country: value as string, city: null }) }
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
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}
