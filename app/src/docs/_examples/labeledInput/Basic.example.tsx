import React, { useState } from 'react';
import { Badge, FlexCell, LabeledInput, LinkButton, TextArea, TextInput } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicTextInputExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width={ 360 }>
            <LabeledInput label="Some label">
                <TextInput value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput label="Left label" labelPosition="left">
                <TextInput value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput label="Label with tooltip" info="This tooltip can be helpful">
                <TextInput value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput label="With validation" isInvalid={ !value } validationMessage="This field is mandatory">
                <TextInput value={ value } isInvalid={ !value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput label="With optional label" isOptional={ true }>
                <TextInput value={ value } isInvalid={ !value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput label="With sideNote" sideNote={ <Badge color="warning" fill="solid" caption="Condition" size="18" /> }>
                <TextInput value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput
                label="With left sideNote"
                sideNote={
                    <>
                        <LinkButton caption="More Details" link={ { pathname: '/' } } size="30" />
                        <div style={ { flexGrow: '100' } }></div>
                    </>
                }
            >
                <TextInput value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput value={ value } label="With footNote" footNote="Some additional text in footNote.">
                <TextInput value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput value={ value } label="With charCounter" maxLength={ 10 } charCounter={ true }>
                <TextArea value={ value } onValueChange={ onValueChange } placeholder="Please type text" maxLength={ 10 } />
            </LabeledInput>
        </FlexCell>
    );
}
