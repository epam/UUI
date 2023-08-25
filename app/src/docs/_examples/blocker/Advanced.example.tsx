import React from 'react';
import { Blocker, Button, DatePicker, FlexCell, FlexRow, FlexSpacer, LabeledInput, NumericInput, TextInput } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function AdvancedExample() {
    const isLoading = true;

    const renderForm = () => {
        return (
            <FlexCell minWidth={ 520 } cx={ css.form }>
                <FlexRow spacing="12" padding="24" vPadding="24">
                    <LabeledInput label="Name">
                        <TextInput isDisabled={ isLoading } value="Alex" onValueChange={ null } />
                    </LabeledInput>
                    <LabeledInput label="Country">
                        <TextInput isDisabled={ isLoading } value="Belarus" onValueChange={ null } />
                    </LabeledInput>
                </FlexRow>
                <FlexRow spacing="12" padding="24" vPadding="24">
                    <LabeledInput label="Age">
                        <NumericInput isDisabled={ isLoading } max={ 100 } min={ 0 } value={ 20 } onValueChange={ null } />
                    </LabeledInput>
                    <LabeledInput label="Country">
                        <DatePicker isDisabled={ isLoading } format="DD/MM/YYYY" value="2042-11-20" onValueChange={ null } />
                    </LabeledInput>
                </FlexRow>
                <FlexRow spacing="12" padding="24" vPadding="24">
                    <FlexSpacer />
                    <Button isDisabled={ isLoading } color="accent" caption="Submit" />
                    <Button isDisabled={ isLoading } color="primary" fill="none" caption="Cancel" />
                </FlexRow>
            </FlexCell>
        );
    };

    return (
        <div className={ css.root }>
            {renderForm()}
            {isLoading && <Blocker isEnabled={ isLoading } hideSpinner={ true } spacerHeight={ 350 } />}
        </div>
    );
}
