import * as React from 'react';
import { dayJsHelper, Dayjs } from '../../../helpers';
import { ILens } from '@epam/uui-core';
import { DatePicker, FlexCell, FlexRow, LabeledInput, RichTextView, TextInput } from '@epam/uui';
import { PersonalInfo } from '../types';
import css from '../DemoForm.module.scss';

export function PersonalInfoSection({ lens }: { lens: ILens<PersonalInfo> }) {
    return (
        <>
            <RichTextView>
                <h2 className={ css.sectionTitle }>Personal Info</h2>
            </RichTextView>

            <FlexRow vPadding="12">
                <FlexCell minWidth={ 324 }>
                    <LabeledInput htmlFor="fullName" label="Full Name" { ...lens.prop('fullName').toProps() }>
                        <TextInput { ...lens.prop('fullName').toProps() } id="fullName" placeholder="Ivan Petrov" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexCell width="auto">
                    <LabeledInput htmlFor="birthDate" label="Date of Birth" { ...lens.prop('birthdayDate').toProps() }>
                        <DatePicker
                            filter={ (day: Dayjs) => day.valueOf() <= dayJsHelper.dayjs().subtract(0, 'day').valueOf() }
                            id="birthDate"
                            format="MMM D, YYYY"
                            { ...lens.prop('birthdayDate').toProps() }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}
