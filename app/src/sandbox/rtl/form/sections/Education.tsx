import { ILens, useArrayDataSource } from '@epam/uui-core';
import { PersonEducation } from '../types';
import { demoData } from '@epam/uui-docs';
import {
    FlexCell, FlexRow, LabeledInput, NumericInput, PickerInput, RichTextView, TextInput,
} from '@epam/uui';
import css from '../DemoForm.module.scss';
import * as React from 'react';
import { IDir } from '../DemoForm';

export function EducationSection({ lens, dir }: { lens: ILens<PersonEducation>, dir: IDir }) {
    const institutionLevelsDataSource = useArrayDataSource(
        {
            items: demoData.universities,
        },
        [],
    );

    return (
        <>
            <RichTextView>
                <h3>Education</h3>
            </RichTextView>

            <FlexRow vPadding="12">
                <FlexCell minWidth={ 324 }>
                    <LabeledInput htmlFor="institution" label="Institution" { ...lens.prop('institution').toProps() }>
                        <PickerInput
                            { ...lens.prop('institution').toProps() }
                            dataSource={ institutionLevelsDataSource }
                            selectionMode="single"
                            id="institution"
                            getName={ (item) => item.university.split(' / ')[0] }
                            sorting={ { field: 'university', direction: 'asc' } }
                            valueType="id"
                            placeholder="Select Institution"
                            rawProps={ { body: { dir: dir } } }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="faculty" label="Faculty" { ...lens.prop('faculty').toProps() }>
                        <TextInput { ...lens.prop('faculty').toProps() } placeholder="Faculty Name" id="faculty" />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="department" label="Department" { ...lens.prop('department').toProps() }>
                        <TextInput { ...lens.prop('department').toProps() } placeholder="Department Name" id="department" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="degree" label="Degree" { ...lens.prop('degree').toProps() }>
                        <TextInput { ...lens.prop('degree').toProps() } placeholder="Degree Name" id="degree" />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="speciality" label="Speciality" { ...lens.prop('speciality').toProps() }>
                        <TextInput { ...lens.prop('speciality').toProps() } placeholder="Speciality Name" id="speciality" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" columnGap="18">
                <FlexCell minWidth={ 120 }>
                    <LabeledInput htmlFor="graduationYear" label="Graduation year" { ...lens.prop('graduationYear').toProps() }>
                        <NumericInput
                            { ...lens.prop('graduationYear').toProps() }
                            min={ 0 }
                            max={ new Date().getFullYear() }
                            placeholder="2020"
                            id="graduationYear"
                            disableLocaleFormatting
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}
