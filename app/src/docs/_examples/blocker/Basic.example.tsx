import React from 'react';
import { Blocker, Button, DatePicker, FlexRow, FlexSpacer, LabeledInput, NumericInput, TextInput } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicExample() {
    const isLoading = true;

    const renderForm = () => {
        return (
            <div className={ css.container }>
                <FlexRow columnGap="12" padding="24" vPadding="24" cx={ css.row }>
                    <LabeledInput label="Name">
                        <TextInput isDisabled={ isLoading } value="Alex" onValueChange={ null } />
                    </LabeledInput>
                    <LabeledInput label="Country">
                        <TextInput isDisabled={ isLoading } value="Belarus" onValueChange={ null } />
                    </LabeledInput>
                </FlexRow>
                <FlexRow columnGap="12" padding="24" vPadding="24">
                    <LabeledInput label="Age">
                        <NumericInput isDisabled={ isLoading } max={ 100 } min={ 0 } value={ 20 } onValueChange={ null } />
                    </LabeledInput>
                    <LabeledInput label="Country">
                        <DatePicker isDisabled={ isLoading } format="DD/MM/YYYY" value="2042-11-20" onValueChange={ null } />
                    </LabeledInput>
                </FlexRow>
                <FlexRow columnGap="12" padding="24" vPadding="24">
                    <FlexSpacer />
                    <Button isDisabled={ isLoading } color="accent" caption="Submit" />
                    <Button isDisabled={ isLoading } color="primary" fill="none" caption="Cancel" />
                </FlexRow>
            </div>
        );
    };

    return (
        <div className={ css.root }>
            {renderForm()}
            <Blocker isEnabled={ isLoading } />
        </div>
    );
}
