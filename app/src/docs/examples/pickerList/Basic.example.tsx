import { Country } from "@epam/uui-docs";
import * as React from "react";
import { AsyncDataSource } from "@epam/uui";
import { svc } from "../../../services";
import { PickerList } from "@epam/loveship";

interface BasicPickerListExampleState {
    countries: string[];
}

export class BasicPickerListExample extends React.Component<any, BasicPickerListExampleState> {
    state: BasicPickerListExampleState = {
        countries: null,
    };

    locationsDataSource = new AsyncDataSource({
        api: (req) => svc.api.demo.countries(req).then(res => res.items),
    });

    render() {
        return (
            <div>
                <PickerList<Country, string>
                    dataSource={ this.locationsDataSource }
                    value={ this.state.countries }
                    onValueChange={ (newVal: string[]) => this.setState({ countries: newVal }) }
                    entityName='location'
                    selectionMode='multi'
                    valueType='id'
                    maxDefaultItems={ 5 }
                    maxTotalItems={ 10 }
                />
            </div>
        );
    }
}