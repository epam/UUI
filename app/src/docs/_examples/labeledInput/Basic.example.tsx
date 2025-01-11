import React, { useState } from 'react';
import { Badge, FlexCell, LabeledInput, LinkButton, TextArea, TextInput } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicTextInputExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width={ 360 }>
            <LabeledInput htmlFor="001" label="Some label">
                <TextInput id="001" value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput htmlFor="002" label="Left label" labelPosition="left">
                <TextInput id="002" value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput htmlFor="003" label="Label with tooltip" info="This tooltip can be helpful">
                <TextInput id="003" value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput htmlFor="004" label="With validation" isInvalid={ !value } validationMessage="This field is mandatory">
                <TextInput id="004" value={ value } isInvalid={ !value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput htmlFor="005" label="With optional label" isOptional={ true }>
                <TextInput id="005" value={ value } isInvalid={ !value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput htmlFor="006" label="With sideNote" sidenote={ <Badge color="warning" fill="solid" caption="Condition" size="24" /> }>
                <TextInput id="006" value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput
                htmlFor="007"
                label="With left sideNote"
                sidenote={ <LinkButton caption="More Details" link={ { pathname: '/' } } size="24" rawProps={ { style: { flexGrow: '100' } } } /> }
            >
                <TextInput id="007" value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput htmlFor="008" value={ value } label="With footNote" footnote="Some additional text in footNote.">
                <TextInput id="008" value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput htmlFor="009" value={ value } label="With charCounter" maxLength={ 10 } charCounter={ true }>
                <TextArea id="009" value={ value } onValueChange={ onValueChange } placeholder="Please type text" maxLength={ 10 } />
            </LabeledInput>
        </FlexCell>
    );
}
