import {City, Country} from "@epam/uui-docs";
import * as React from "react";
import {AsyncDataSource, LazyDataSource} from "@epam/uui";
import {svc} from "../../../services";
import {FlexCell, LabeledInput, PickerInput} from "@epam/promo";

interface LocationLinkedPickersState {
    country: Country;
    cities: string[];
}

export class ArrayLinkedPickers extends React.Component<any, LocationLinkedPickersState> {
    state: LocationLinkedPickersState = {
        country: null,
        cities: null,
    };

    countryDataSource = new AsyncDataSource({
        api: () => svc.api.demo.countries({}).then(r => r.items),
    });

    citiesDataSource = new LazyDataSource({
        api: (req) => svc.api.demo.cities(req),
    });

    render() {
        return (
            <FlexCell width={ 300 }>
                <LabeledInput label='Select country'>
                    <PickerInput<Country, string>
                        dataSource={ this.countryDataSource }
                        value={ this.state.country }
                        onValueChange={ (newVal: Country) => this.setState({country: newVal, cities: null}) }
                        entityName='Country'
                        selectionMode='single'
                        valueType='entity'
                    />
                </LabeledInput>

                <LabeledInput label={ this.state.country ? `Select city from ${this.state.country.name}` : 'Select city' }>
                    <PickerInput<City, string>
                        dataSource={ this.citiesDataSource }
                        value={ this.state.cities }
                        onValueChange={ (newVal: string[]) => this.setState({cities: newVal}) }
                        isDisabled={ !this.state.country }
                        entityName='City'
                        selectionMode='multi'
                        valueType='id'
                        filter={ { country: this.state.country?.id } } // Your filter object, which will be send to the server
                    />
                </LabeledInput>
            </FlexCell>
        );
    }
}