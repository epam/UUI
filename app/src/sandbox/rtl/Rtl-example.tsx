import React, { useState } from 'react';
import { DatePicker, FlexCell, FlexRow, LabeledInput, MultiSwitch, RangeDatePicker, RichTextView, Switch, TextArea, TextInput } from '@epam/uui';

type IDir = 'ltr' | 'rtl' | 'auto';

const rtlSwitchItems = [{ id: 'ltr', caption: 'Ltr' }, { id: 'rtl', caption: 'Rtl' }, { id: 'auto', caption: 'Auto' }];

export function RtlExample() {
    const [value, setValue] = useState('');
    const [labelDir, setLabelDir] = useState<IDir>('ltr');
    const [inputDir, setInputDir] = useState<IDir>('ltr');
    const [labelDateDir, setlabelDateDir] = useState<IDir>('ltr');
    const [dateDir, setDateDir] = useState<IDir>('ltr');
    const [switchDir, setSwitchDir] = useState<IDir>('ltr');
    const [textAreaDir, setTextAreaDir] = useState<IDir>('ltr');
    const [dateValue, setDateValue] = useState('');
    const [rangeValue, setRangeValue] = useState({ from: null, to: null });
    const [switchValue, setSwitchValue] = useState(false);
    const [textAreaValue, settextAreaValue] = useState('');

    return (
        <>
            <FlexCell width={ 400 }>
                <FlexRow padding="24">
                    <RichTextView>
                        <h3>LabeledInput & TextInput</h3>
                    </RichTextView>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" columnGap="24">
                    <LabeledInput label="Label dir" labelPosition="top">
                        <MultiSwitch
                            value={ labelDir }
                            onValueChange={ setLabelDir }
                            items={ rtlSwitchItems }
                        />
                    </LabeledInput>
                    <LabeledInput label="Input dir" labelPosition="top">
                        <MultiSwitch
                            value={ inputDir }
                            onValueChange={ setInputDir }
                            items={ rtlSwitchItems }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Address" labelPosition="left" rawProps={ { dir: labelDir } }>
                        <TextInput
                        // mode="inline"
                            value={ value }
                            onValueChange={ setValue }
                            rawProps={ { dir: inputDir } }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Address" labelPosition="top" rawProps={ { dir: labelDir } }>
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
                <FlexRow padding="24">
                    <LabeledInput label="Switch dir" labelPosition="top">
                        <MultiSwitch
                            value={ switchDir }
                            onValueChange={ setSwitchDir }
                            items={ rtlSwitchItems }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <Switch label="Default" value={ switchValue } onValueChange={ setSwitchValue } rawProps={ { dir: switchDir } } size="24" />
                </FlexRow>
            </FlexCell>

            {/*  -------  */}

            <FlexCell width={ 400 }>
                <FlexRow padding="24">
                    <RichTextView>
                        <h3>Date & DateRange</h3>
                    </RichTextView>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" columnGap="24">
                    <LabeledInput label="DatePickerLabel dir" labelPosition="top">
                        <MultiSwitch
                            value={ labelDateDir }
                            onValueChange={ setlabelDateDir }
                            items={ rtlSwitchItems }
                        />
                    </LabeledInput>
                    <LabeledInput label="DatePicker dir" labelPosition="top">
                        <MultiSwitch
                            value={ dateDir }
                            onValueChange={ setDateDir }
                            items={ rtlSwitchItems }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Date" labelPosition="left" rawProps={ { dir: labelDateDir } }>
                        <DatePicker
                            value={ dateValue }
                            onValueChange={ setDateValue }
                            rawProps={ { input: { dir: dateDir }, body: { dir: dateDir } } }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="RangeDatePicker" labelPosition="top" rawProps={ { dir: labelDateDir } }>
                        <RangeDatePicker
                            value={ rangeValue }
                            onValueChange={ setRangeValue }
                            rawProps={ { from: { dir: dateDir }, to: { dir: dateDir }, body: { dir: dateDir } } }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24">
                    <RichTextView>
                        <h3>TextArea</h3>
                    </RichTextView>
                </FlexRow>
                <FlexRow padding="24">
                    <LabeledInput label="Switch dir" labelPosition="top">
                        <MultiSwitch
                            value={ textAreaDir }
                            onValueChange={ setTextAreaDir }
                            items={ rtlSwitchItems }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding="24" vPadding="24" alignItems="top">
                    <LabeledInput label="Notes" rawProps={ { dir: textAreaDir } }>
                        <TextArea rawProps={ { dir: textAreaDir } } value={ textAreaValue } onValueChange={ settextAreaValue } placeholder="Type text" />
                    </LabeledInput>
                </FlexRow>
            </FlexCell>

        </>
    );
}
