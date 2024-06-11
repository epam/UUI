import * as React from 'react';
import { UuiContexts, useUuiContext } from '@epam/uui-core';
import type { TApi } from '../../../data';
import { FlexCell, FlexRow, FlexSpacer, Panel, RichTextView, SuccessNotification, Text, Button, useForm, MultiSwitch, LabeledInput } from '@epam/uui';
import type { PersonDetails } from './types';
import { personDetailsSchema } from './validationShema';
import { defaultData, emptyInfo } from './defaultData';
import css from './DemoForm.module.scss';
import {
    EducationSection, LanguagesSection, OtherInfoSection, PersonalInfoSection, PrimaryInfoSection, VisasSection, LocationSection,
} from './sections';
import { useState } from 'react';

export type IDir = 'ltr' | 'rtl' | 'auto';

export function DemoForm() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [dir, setDir] = useState<IDir>('ltr');

    const { lens, save } = useForm<PersonDetails>({
        settingsKey: 'form-test',
        value: defaultData,
        getMetadata: personDetailsSchema,
        onSave: (person) => Promise.resolve({ form: person }),
        onSuccess: () =>{
            svc.uuiNotifications.show(
                (props) => (
                    <SuccessNotification { ...props }>
                        <Text size="36" fontSize="14">
                            Data has been saved!
                        </Text>
                    </SuccessNotification>
                ),
                { duration: 2 },
            ).catch(() => null);
        },
    });

    return (
        <div className={ css.root } dir={ dir }>
            <FlexRow size="48">
                <RichTextView>
                    <h1>My Profile</h1>
                </RichTextView>
                <FlexSpacer />
                <FlexCell width={ 200 }>
                    <LabeledInput label="Root dir" labelPosition="top">
                        <MultiSwitch
                            value={ dir }
                            onValueChange={ setDir }
                            items={ [{ id: 'ltr', caption: 'Ltr' }, { id: 'rtl', caption: 'Rtl' }, { id: 'auto', caption: 'Auto' }] }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <Panel background="surface-main" cx={ css.formPanel } shadow>
                <FlexCell width="100%">
                    <PersonalInfoSection lens={ lens.prop('personalInfo') } dir={ dir } />
                    <LocationSection lens={ lens.prop('location') } />
                    <PrimaryInfoSection lens={ lens.prop('primaryInfo') } />
                    <EducationSection lens={ lens.prop('education') } />
                    <LanguagesSection lens={ lens.prop('languageInfo').default([emptyInfo.language]) } />
                    <VisasSection lens={ lens.prop('travelVisas') } dir={ dir } />
                    <OtherInfoSection lens={ lens.prop('otherInfo') } />
                    <hr className={ css.divider } />
                    <FlexRow columnGap="12">
                        <FlexSpacer />
                        <Button caption="Save" color="primary" onClick={ save } />
                    </FlexRow>
                </FlexCell>
            </Panel>
        </div>
    );
}
