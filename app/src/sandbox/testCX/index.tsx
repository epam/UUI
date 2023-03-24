import React, { useState } from "react";
import { DatePicker, FlexCell, FlexRow, PickerInput, RangeDatePicker, Text, TimePicker } from "@epam/promo";
import { useArrayDataSource } from "@epam/uui-core";

const languageLevels = [
    { "id": 2, "level": "A1" },
    { "id": 3, "level": "A1+" },
    { "id": 4, "level": "A2" },
    { "id": 5, "level": "A2+" },
    { "id": 6, "level": "B1" },
    { "id": 7, "level": "B1+" },
    { "id": 8, "level": "B2" },
    { "id": 9, "level": "B2+" },
    { "id": 10, "level": "C1" },
    { "id": 11, "level": "C1+" },
    { "id": 12, "level": "C2" },
];

export const TestCX = () => {
    const [idate, setIdate] = useState('2023-03-23');
    const [singlePickerValue, singleOnValueChange] = useState(null);
    const [value, onValueChange] = useState({ from: null, to: null });
    const [timeValue, timeOnValueChange] = useState({ hours: null, minutes: null });

    const dataSource = useArrayDataSource({
        items: languageLevels,
    }, []);


    return (
        <>
            <div style={ { justifyItems: 'start' } }>
                <FlexRow margin="12">
                    <Text fontSize="18" font="sans-semibold">Test for inputCx and bodyCX props which using for composed components.</Text>
                </FlexRow>
                <FlexRow margin="24">
                    <FlexCell width="auto">
                        <DatePicker
                            value={ idate }
                            onValueChange={ setIdate }
                            inputCx={ 'INPUT-CX-CLASS' }
                            bodyCx={ 'BODY-CX-CLASS' }
                        />
                    </FlexCell>
                </FlexRow>
                <FlexRow margin="24">
                    <FlexCell width="auto">
                        <PickerInput
                            dataSource={ dataSource }
                            value={ singlePickerValue }
                            onValueChange={ singleOnValueChange }
                            getName={ item => item.level }
                            entityName="Language level"
                            selectionMode="single"
                            valueType={ 'id' }
                            sorting={ { field: 'level', direction: 'asc' } }
                            inputCx={ 'INPUT-CX-CLASS' }
                            bodyCx={ 'BODY-CX-CLASS' }
                        />
                    </FlexCell>
                </FlexRow>
                <FlexRow margin="24">
                    <FlexCell width="auto">
                        <RangeDatePicker
                            value={ value }
                            onValueChange={ onValueChange }
                            format="MMM D, YYYY"
                            inputCx={ 'INPUT-CX-CLASS' }
                            bodyCx={ 'BODY-CX-CLASS' }
                        />
                    </FlexCell>
                </FlexRow>
                <FlexRow margin="24">
                    <FlexCell width="auto">
                        <TimePicker
                            onValueChange={ timeOnValueChange }
                            value={ timeValue }
                            inputCx={ 'INPUT-CX-CLASS' }
                            bodyCx={ 'BODY-CX-CLASS' }
                            format={ 24 }
                        />
                    </FlexCell>
                </FlexRow>
            </div>
        </>
    );
};