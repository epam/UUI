import React from 'react';
import { renderer } from '@epam/uui-test-utils';
import { DataPickerRow } from '../DataPickerRow';

describe('DataPickerRow', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<DataPickerRow size="36" id="test" index={ 1 } renderItem={ (item: React.ReactNode) => <div>{item}</div> } rowKey="test" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(
                <DataPickerRow
                    id="test"
                    index={ 1 }
                    renderItem={ (item: React.ReactNode) => <div>{item}</div> }
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
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
