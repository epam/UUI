import React from 'react';
import { LabeledInput } from '../LabeledInput';
import { TextInput } from '../../inputs';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('LabeledInput', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <LabeledInput>
                <TextInput value={ null } onValueChange={ () => {} } />
            </LabeledInput>,
        );

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <LabeledInput
                label="Test label"
                size="30"
                info="Test info"
                isInvalid={ true }
                validationMessage="Test validation message"
                labelPosition="left"
                isOptional={ true }
                isRequired={ true }
                charCounter={ true }
                maxLength={ 10 }
                footnote="Footnote text"
                sidenote="Sidenote text"
            >
                <TextInput value={ null } onValueChange={ () => {} } />
            </LabeledInput>,
        );

        expect(tree).toMatchSnapshot();
    });
});
