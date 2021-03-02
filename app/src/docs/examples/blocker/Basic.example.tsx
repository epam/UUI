import * as React from 'react';
import { Blocker, Button, DatePicker, FlexCell, FlexRow, FlexSpacer, LabeledInput, NumericInput, TextInput } from '@epam/promo';
import css from './BasicExample.scss';

export function BasicExample() {
    const isLoading = true;

    const renderForm = () => {
        return (
            <FlexCell minWidth={ 520 } cx={ css.form } >
                <FlexRow padding='24' vPadding='24'>
                    <LabeledInput>
                        <LabeledInput label='Name' >
                            <TextInput value={ 'Alex' }  onValueChange={ null }/>
                        </LabeledInput>
                    </LabeledInput>
                    <LabeledInput>
                        <LabeledInput label='Country' >
                            <TextInput value={ 'Belarus' }  onValueChange={ null }/>
                        </LabeledInput>
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding='24' vPadding='24'>
                    <LabeledInput>
                        <LabeledInput label='Age' >
                            <NumericInput max={ 100 } min={ 0 } value={ 20 } onValueChange={ null }/>
                        </LabeledInput>
                    </LabeledInput>
                    <LabeledInput>
                        <LabeledInput label='Country' >
                            <DatePicker format={ 'DD/MM/YYYY' } value={ '20/11/2042' }  onValueChange={ null }/>
                        </LabeledInput>
                    </LabeledInput>
                </FlexRow>
                <FlexRow padding='24' vPadding='24'>
                    <FlexSpacer/>
                    <Button color='green' caption='Submit'/>
                    <Button color='blue' fill='none'  caption='Cancel'/>
                </FlexRow>
            </FlexCell>
        );
    };

    return (
        <div className={ css.root } >
            { renderForm() }
            { isLoading && <Blocker isEnabled={ isLoading } /> }
        </div>
    );
}