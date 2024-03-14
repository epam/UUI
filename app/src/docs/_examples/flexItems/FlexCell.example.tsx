import React, { useState } from 'react';
import { FlexRow, FlexSpacer, Panel, Text, Button, LabeledInput, TextInput, FlexCell, CheckboxGroup } from '@epam/uui';
import css from './FlexCellExample.module.scss';

export default function FlexCellExample() {
    const [value, onValueChange] = useState(null);

    return (
        <Panel background="surface-main" shadow cx={ css.root }>
            <FlexRow padding="12">
                <Text fontWeight="600" size="48">
                    Identity Document
                </Text>
            </FlexRow>
            <FlexRow padding="12" vPadding="18" columnGap="18">
                <FlexCell width="auto" grow={ 2 }>
                    <FlexRow padding="12" vPadding="18">
                        <LabeledInput label="First Name">
                            <TextInput placeholder="First Name" value="" onValueChange={ () => null } />
                        </LabeledInput>
                    </FlexRow>
                    <FlexRow padding="12" vPadding="18">
                        <LabeledInput label="Last Name">
                            <TextInput placeholder="Last Name" value="" onValueChange={ () => null } />
                        </LabeledInput>
                    </FlexRow>
                </FlexCell>
                <FlexCell width="auto" grow={ 1 } cx={ css.checkboxGroup }>
                    <CheckboxGroup
                        items={ [
                            { id: 1, name: 'Mentee' }, { id: 2, name: 'Mentor' }, { id: 3, name: 'Coordinator' }, { id: 4, name: 'Moderator' },
                        ] }
                        value={ value }
                        onValueChange={ onValueChange }
                        direction="vertical"
                    />
                </FlexCell>
            </FlexRow>
            <FlexSpacer />

            <FlexRow padding="12" vPadding="12" columnGap="12">
                <FlexSpacer />

                <Button caption="Submit" onClick={ () => null } color="accent" />
                <Button caption="Cancel" onClick={ () => null } color="secondary" />
            </FlexRow>
        </Panel>
    );
}
