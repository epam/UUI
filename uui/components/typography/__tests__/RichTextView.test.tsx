import React from 'react';
import { render } from '@epam/uui-test-utils';
import { RichTextView } from '../RichTextView';

describe('RichTextView', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <RichTextView>
                <p>Test</p>
            </RichTextView>,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <RichTextView size="16">
                <div>Test</div>
            </RichTextView>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
