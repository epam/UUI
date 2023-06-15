import React from 'react';
import { renderer } from '@epam/uui-test-utils';
import { SnackbarCard } from '../SnackbarCard';

describe('SnackbarCard', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<SnackbarCard id={ 1 } key="1" snackType="danger" onClose={ jest.fn() } onSuccess={ jest.fn() } />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
