import React, { useState } from 'react';
import { FlexCell, FlexRow, LabeledInput, PickerInput, MultiSwitch, Button, Switch, TextInput, useForm, FlexSpacer, RichTextView } from '@epam/uui';
import { ReactComponent as ActionAccountFillIcon } from '@epam/assets/icons/action-account-fill.svg';
import { PersonDetails } from '@epam/uui-docs';
import { useArrayDataSource } from '@epam/uui-core';

export default function RtlExample() {
    const [isRemote, changeIsRemote] = useState<boolean>(false);
    const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

    const { lens } = useForm<PersonDetails>({
        value: {},
        onSave: (person) => Promise.resolve({ form: person }),
    });

    const countriesDS = useArrayDataSource({ items: texts[dir].countries }, []);

    const renderToolbar = () => {
        return (
            <FlexRow>
                <MultiSwitch
                    items={ [{ id: 'ltr', caption: 'LTR' }, { id: 'rtl', caption: 'RTL' }] }
                    value={ dir }
                    onValueChange={ setDir }
                />
            </FlexRow>
        );
    };

    return (
        <FlexCell grow={ 1 }>
            { renderToolbar() }

            <div dir={ dir }>
                <RichTextView>
                    <h3>{ texts[dir].title }</h3>
                </RichTextView>
                <FlexRow vPadding="12">
                    <FlexCell minWidth={ 324 }>
                        <LabeledInput htmlFor="fullName" label={ texts[dir].userNameLabel } { ...lens.prop('firstName').toProps() }>
                            <TextInput icon={ ActionAccountFillIcon } { ...lens.prop('firstName').toProps() } id="fullName" placeholder={ texts[dir].userNamePlaceholder } />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding="12">
                    <FlexCell minWidth={ 324 }>
                        <LabeledInput htmlFor="country" label={ texts[dir].countryLabel } { ...lens.prop('countryId').toProps() }>
                            <PickerInput
                                { ...lens.prop('countryId').toProps() }
                                dataSource={ countriesDS }
                                selectionMode="single"
                                valueType="id"
                                id="country"
                                placeholder={ texts[dir].countryPlaceholder }
                                onValueChange={ (inputValue) => lens.set({ countryId: inputValue as string, city: null }) }
                                rawProps={ { body: { dir: 'rtl' } } }
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding="12">
                    <Switch value={ isRemote } onValueChange={ changeIsRemote } label={ texts[dir].remoteLabel } />
                </FlexRow>
                <FlexRow vPadding="12">
                    <FlexCell minWidth={ 324 }>
                        <FlexRow>
                            <FlexSpacer />
                            <Button caption={ texts[dir].saveCaption } onClick={ () => {} } />
                        </FlexRow>
                    </FlexCell>
                </FlexRow>
            </div>

        </FlexCell>
    );
}

const texts = {
    ltr: {
        title: 'Profile',
        userNameLabel: 'Full Name',
        userNamePlaceholder: 'John Doe',
        dateLabel: 'Date of Birth',
        countryLabel: 'Country',
        countryPlaceholder: 'Select country',
        remoteLabel: 'Remote',
        saveCaption: 'Save',
        countries: [
            {
                id: '1',
                name: 'Belarus',
            },
            {
                id: '2',
                name: 'Ukraine',
            },
            {
                id: '3',
                name: 'United Arab Emirates',
            },
            {
                id: '4',
                name: 'Qatar',
            },
        ],
    },
    rtl: {
        title: 'الملف الشخصي',
        userNameLabel: 'الاسم الكامل',
        userNamePlaceholder: 'جون دو',
        dateLabel: 'تاريخ الميلاد',
        countryLabel: 'البلد',
        countryPlaceholder: 'اختر البلد',
        remoteLabel: 'عن بعد',
        saveCaption: 'حفظ',
        countries: [
            {
                id: '1',
                name: 'بيلاروسيا',
            },
            {
                id: '2',
                name: 'أوكرانيا',
            },
            {
                id: '3',
                name: 'الإمارات العربية المتحدة',
            },
            {
                id: '4',
                name: 'قطر',
            },
        ],
    },
};
