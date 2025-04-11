import React from 'react';
import { render } from '@epam/uui-test-utils';
import { DataPickerRow } from '../DataPickerRow';

describe('DataPickerRow', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <DataPickerRow<{ name: string }, string>
                size="36"
                id="test"
                index={ 1 }
                getName={ (i) => i.name }
                renderItem={ (item) => <div>{item.name}</div> }
                rowKey="test"
                value={ { name: 'test' } }
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <DataPickerRow<{ name: string }, string>
                getName={ (i) => i.name }
                value={ { name: 'test' } }
                id="test"
                index={ 1 }
                renderItem={ (item) => <div>{item.name}</div> }
                rowKey="test"
                padding="24"
                size="48"
                isChecked
                isChildrenChecked
                isFocused
                isFoldable
                isFolded
                isSelectable
                isSelected
                onSelect={ jest.fn }
                onFold={ jest.fn }
                onCheck={ jest.fn }
                onClick={ jest.fn }
                onFocus={ jest.fn }
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
