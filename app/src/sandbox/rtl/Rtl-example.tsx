import React, { useState } from 'react';
import { DatePicker, FlexCell, FlexRow, LabeledInput, MultiSwitch, RangeDatePicker, RichTextView, Switch, TextArea, TextInput, Text } from '@epam/uui';

type IDir = undefined | 'auto';

const rtlSwitchItems = [{ id: undefined, caption: 'html' }, { id: 'auto', caption: 'Auto' }];

export function RtlExample() {
    const [value, setValue] = useState('');
    const [inputDir, setInputDir] = useState<IDir>();
    const [textAreaDir, setTextAreaDir] = useState<IDir>();
    const [dateValue, setDateValue] = useState('');
    const [rangeValue, setRangeValue] = useState({ from: null, to: null });
    const [switchValue, setSwitchValue] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState('');

    return (
        <>
            <FlexCell width={ 400 }>
                <FlexRow padding="24">
                    <RichTextView>
                        <h3>LabeledInput & TextInput</h3>
                    </RichTextView>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" columnGap="24">
                    <LabeledInput label="Input dir" labelPosition="top">
                        <MultiSwitch
                            value={ inputDir }
                            onValueChange={ setInputDir }
                            items={ rtlSwitchItems }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Address" labelPosition="left">
                        <TextInput
                        // mode="inline"
                            value={ value }
                            onValueChange={ setValue }
                            rawProps={ { dir: inputDir } }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Address" labelPosition="top">
                        <TextInput
                        // mode="inline"
                            value={ value }
                            onValueChange={ setValue }
                            rawProps={ { dir: inputDir } }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24">
                    <RichTextView>
                        <h3>Switch</h3>
                    </RichTextView>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <Switch label="Power" value={ switchValue } onValueChange={ setSwitchValue } size="24" />
                </FlexRow>
            </FlexCell>

            {/*  -------  */}

            <FlexCell width={ 400 }>
                <FlexRow padding="24">
                    <RichTextView>
                        <h3>Date & DateRange</h3>
                    </RichTextView>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Date" labelPosition="left">
                        <DatePicker
                            value={ dateValue }
                            onValueChange={ setDateValue }
                            // rawProps={ { input: { dir: dateDir }, body: { dir: dateDir } } }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="RangeDatePicker" labelPosition="top">
                        <RangeDatePicker
                            value={ rangeValue }
                            onValueChange={ setRangeValue }
                            // rawProps={ { from: { dir: dateDir }, to: { dir: dateDir }, body: { dir: dateDir } } }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24">
                    <RichTextView>
                        <h3>TextArea & Text</h3>
                    </RichTextView>
                </FlexRow>
                <FlexRow padding="24">
                    <LabeledInput label="Text dir" labelPosition="top">
                        <MultiSwitch
                            value={ textAreaDir }
                            onValueChange={ setTextAreaDir }
                            items={ rtlSwitchItems }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Notes" rawProps={ { dir: textAreaDir } }>
                        <TextArea rawProps={ { dir: textAreaDir } } value={ textAreaValue } onValueChange={ setTextAreaValue } placeholder="Type text" />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Notes" rawProps={ { dir: textAreaDir } }>
                        <Text color="primary" fontSize="18">
                            أهلاً بكم! هذا مثال على نص بحجم 18
                        </Text>
                    </LabeledInput>
                </FlexRow>
            </FlexCell>

        </>
    );
}
