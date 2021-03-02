import React from 'react';
import renderer from 'react-test-renderer';
import { PickerToggler } from '../PickerToggler';

describe('PickerToggler', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<PickerToggler
                pickerMode='single'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<PickerToggler
                pickerMode='multi'
                onClick={ jest.fn }
                onKeyDown={ jest.fn }
                value={ null }
                onValueChange={ jest.fn }
                size='48'
                maxItems={ 6 }
                getName={ item => item.value }
                selection={ [
                    {
                        id: 'test',
                        index: 1,
                        rowKey: 'test',
                        value: 'test',
                    },
                ] }
                onBlur={ jest.fn }
                onClear={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


