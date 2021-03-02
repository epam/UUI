import { Location } from "@epam/uui-docs";
import * as React from "react";
import { AsyncDataSource } from "@epam/uui";
import { svc } from "../../../services";
import { PickerInput } from "@epam/promo";

interface AsyncPickerInputState {
    locations: string[];
}

export class AsyncPickerInputExample extends React.Component<any, AsyncPickerInputState> {
    state: AsyncPickerInputState = {
        locations: null,
    };

    locationsDataSource = new AsyncDataSource({
        api: (req) => svc.api.demo.locations(req).then(res => res.items),
    });

    render() {
        return (
            <div>
                <PickerInput<Location, string>
                    dataSource={ this.locationsDataSource }
                    value={ this.state.locations }
                    onValueChange={ (newVal: string[]) => this.setState({ locations: newVal }) }
                    entityName='location'
                    selectionMode='multi'
                    valueType='id'
                />
            </div>
        );
    }
}