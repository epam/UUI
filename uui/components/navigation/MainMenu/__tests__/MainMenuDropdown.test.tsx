import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { MainMenuDropdown } from '../MainMenuDropdown';
import { MainMenuButton } from '../MainMenuButton';

describe('MainMenuDropdown', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<MainMenuDropdown renderBody={ () => null } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenuDropdown
                renderBody={ () => {
                    return (
                        <>
                            <MainMenuButton caption="Impact" />
                            <MainMenuButton caption="ENGX" />
                            <MainMenuButton caption="Cloud" />
                        </>
                    );
                } }
                caption="Test button"
                estimatedWidth={ 120 }
                priority={ 6 }
            >
                
            </MainMenuDropdown>,
        );
        expect(tree).toMatchSnapshot();
    });
});
