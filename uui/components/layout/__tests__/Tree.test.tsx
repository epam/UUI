import React from 'react';
import { Tree, TreeProps } from '../Tree';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { renderWithContextAsync } from '@epam/uui-test-utils';

interface TestTreeItem {
    id: string;
    name: string;
    parentId?: string;
}

const testData: TestTreeItem[] = [
    { id: '1', name: 'Root', parentId: undefined },
    { id: '2', name: 'Child 1', parentId: '1' },
    { id: '3', name: 'Child 2', parentId: '1' },
];

function TestTreeComponent(props: { renderRow?: TreeProps<TestTreeItem, string>['renderRow'] }) {
    const [value, setValue] = React.useState<DataSourceState>({ folded: {} });

    const dataSource = useArrayDataSource<TestTreeItem, string, unknown>(
        {
            items: testData,
            getId: (item) => item.id,
        },
        [testData],
    );

    const view = dataSource.useView(value, setValue);

    return (
        <Tree<TestTreeItem>
            view={ view }
            value={ value }
            onValueChange={ setValue }
            renderRow={ props.renderRow }
        />
    );
}

describe('Tree', () => {
    it('should render tree items with default VerticalTabButton', async () => {
        const tree = await renderWithContextAsync(<TestTreeComponent />);
        expect(tree).toMatchSnapshot();
    });

    it('should render custom row when renderRow is provided', async () => {
        const tree = await renderWithContextAsync(
            <TestTreeComponent
                renderRow={ (row) => (
                    <div key={ row.key } data-testid={ `custom-item-${row.id}` }>
                        Custom:
                        {' '}
                        {row.value.name}
                    </div>
                ) }
            />,
        );

        expect(tree).toMatchSnapshot();
    });
});
