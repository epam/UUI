import React from 'react';
import { ConfirmationModal } from '../ConfirmationModal';
import renderer from 'react-test-renderer';

describe('ConfirmationModal', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ConfirmationModal
                caption='Test'
                key='test-key'
                success={ result => jest.fn(result) }
                abort={ jest.fn }
                isActive
                zIndex={ 1 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ConfirmationModal
                caption='Test'
                key='test-key'
                success={ result => jest.fn(result) }
                abort={ jest.fn }
                isActive
                zIndex={ 1 }
                bodyContent={ <div>Test content</div> }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


