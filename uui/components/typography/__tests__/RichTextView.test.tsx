import React from 'react';
import { RichTextView } from '../RichTextView';
import renderer from 'react-test-renderer';

describe('RichTextView', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<RichTextView><p>Test</p></RichTextView>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<RichTextView
                size='16'
            >
                <div>Test</div>
            </RichTextView>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


