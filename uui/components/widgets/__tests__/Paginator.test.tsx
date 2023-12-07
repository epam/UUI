import React from 'react';
import { Paginator } from '../Paginator';
import { renderer } from '@epam/uui-test-utils';

describe('Paginator', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Paginator
            value={ null }
            onValueChange={ () => {} }
            totalPages={ 10 }
            size="24"
            rawProps={ {
                id: '123',
                'data-my_attr': 'value',
            } }
        />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
