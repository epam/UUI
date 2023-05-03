import React from 'react';
import { Badge } from '../Badge';
import { renderSnapshotWithContextAsync, SvgMock } from '@epam/uui-test-utils';

describe('Badge', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Badge />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Badge
                caption="Test badge"
                fill="semitransparent"
                color="amber"
                icon={ SvgMock }
                count={ 12 }
                onIconClick={ () => {} }
                onClick={ () => {} }
                onClear={ () => {} }
                size="36"
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
