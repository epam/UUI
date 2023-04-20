import React from 'react';
import { FileCard } from '../FileCard';
import renderer from 'react-test-renderer';

describe('FileCard', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(
                <FileCard
                    file={ {
                        id: 1,
                        name: 'Test.xls',
                        size: 12546,
                        progress: 0,
                    } }
                />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(
                <FileCard
                    file={ {
                        id: 1,
                        name: 'Test.doc',
                        size: 12546,
                        progress: 0,
                    } }
                    width={ 140 }
                    onClick={ jest.fn }
                />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(
                <FileCard
                    file={ {
                        id: 1,
                        name: 'Test.gif',
                        size: 12546,
                        progress: 100,
                    } }
                    width={ 140 }
                    onClick={ jest.fn }
                />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
