import { screen } from '@epam/uui-test-utils';
import { render } from '../test-utils';
import EditorPage from '../../pages/editor';
import React from 'react';

describe('Page with table with demo data from uuiApp is rendered', () => {
    it('should render', () => {
        render(<EditorPage />);
        const main = screen.getByText('Demo example with RichTextEditor(RTE)');
        expect(main).toBeInTheDocument();
    });
});
