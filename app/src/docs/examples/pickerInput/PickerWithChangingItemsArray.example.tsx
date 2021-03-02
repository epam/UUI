import * as React from "react";
import {LanguageLevel, demoData} from "@epam/uui-docs";
import memoizeOne from "memoize-one";
import {ArrayDataSource} from "@epam/uui";
import {PickerInput, MultiSwitch, FlexRow, FlexCell} from "@epam/promo";

const fullLevelsList = demoData.languageLevels;
const shortLevelsList = demoData.languageLevels.slice(5);

interface LanguageLevelsArraySinglePickerState {
    pickerValue: string;
    items: LanguageLevel[];
}

export class LanguageLevelsArraySinglePicker extends React.Component<any, LanguageLevelsArraySinglePickerState> {
    state: LanguageLevelsArraySinglePickerState = {
        pickerValue: null,
        items: fullLevelsList,
    };

    // Use memoize functions, because DataSource should not be recreated on each call.
    getLanguageLevelsDataSource = memoizeOne(
        (items: LanguageLevel[]) => new ArrayDataSource({items: items}),
    );

    render() {
        return (
            <FlexCell width={ 300 }>
                <FlexRow vPadding='12'>
                    <MultiSwitch size='24' value={ this.state.items } onValueChange={ (newVal) => this.setState({items: newVal}) } items={ [
                        {
                            id: fullLevelsList,
                            caption: 'Full levels list',
                        },
                        {
                            id: shortLevelsList,
                            caption: 'Short levels list',
                        },
                    ] } />
                </FlexRow>

                <PickerInput
                    dataSource={ this.getLanguageLevelsDataSource(this.state.items) }
                    value={ this.state.pickerValue }
                    onValueChange={ (newValue: string) => this.setState({ pickerValue: newValue }) }
                    getName={ item => item.level }
                    entityName='Language level'
                    selectionMode='single'
                    valueType='id'
                />
            </FlexCell>
        );
    }
}