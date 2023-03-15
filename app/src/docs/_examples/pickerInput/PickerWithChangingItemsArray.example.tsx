import React, { useState } from "react";
import { demoData } from "@epam/uui-docs";
import { useArrayDataSource } from "@epam/uui-core";
import {PickerInput, MultiSwitch, FlexRow, FlexCell} from "@epam/promo";

const fullLevelsList = demoData.languageLevels;
const shortLevelsList = demoData.languageLevels.slice(5);

export default function LanguageLevelsArraySinglePicker() {
    const [pickerValue, setPickerValue] = useState<string>();
    const [items, setItems] = useState(fullLevelsList);

    // Memoization, because DataSource should not be recreated on each call.
    const languageLevelsDataSource = useArrayDataSource({ items }, [items]);

    return (
        <FlexCell width={ 300 }>
            <FlexRow vPadding='12'>
                <MultiSwitch
                    size='24'
                    value={ items }
                    onValueChange={ setItems }
                    items={ [
                        {
                            id: fullLevelsList,
                            caption: 'Full levels list',
                        },
                        {
                            id: shortLevelsList,
                            caption: 'Short levels list',
                        },
                    ] }
                />
            </FlexRow>

            <PickerInput
                dataSource={ languageLevelsDataSource }
                value={ pickerValue }
                onValueChange={ setPickerValue }
                getName={ item => item.level }
                entityName='Language level'
                selectionMode='single'
                valueType='id'
            />
        </FlexCell>
    );
}