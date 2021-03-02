import React from 'react';
import { DropSpot } from '../DropSpot';
import renderer from 'react-test-renderer';

describe('DropSpot', () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<DropSpot onUploadFiles={ jest.fn } />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {

        const tree = renderer
            .create(<DropSpot
                onUploadFiles={ jest.fn }
                infoText='Test info'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});