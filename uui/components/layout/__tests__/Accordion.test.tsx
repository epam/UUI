import React from 'react';
import { Accordion } from '../Accordion';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { settings } from '../../../settings';

describe('Accordion', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Accordion title="Test title" />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Accordion
                title="Test title"
                mode="inline"
                dropdownIcon={ settings.accordion.icons.dropdownIcon }
                padding="18"
                isDisabled={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
