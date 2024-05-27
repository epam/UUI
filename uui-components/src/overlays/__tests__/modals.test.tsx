import React from 'react';
import { fireEvent, renderWithContextAsync, screen } from '@epam/uui-test-utils';
import { useUuiContext } from '@epam/uui-core';
import { Button } from '../../buttons';
import { Modals } from '../Modals';

function TestContent() {
    return (<div>Test content</div>);
}

function Test() {
    const { uuiModals } = useUuiContext();
    return (
        <div>
            <Button
                caption="Show modal"
                onClick={
                    async () => {
                        try {
                            return await uuiModals
                                .show((props) => <TestContent { ...props } />);
                        } catch {
                        }
                    }
                }
            />
            <Modals />
        </div>
    );
}

describe('Modals', () => {
    it('should render children component', async () => {
        const tree = await renderWithContextAsync(<Test />);
        const button = await screen.findByText('Show modal');

        fireEvent.click(button);
        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();
        expect(tree).toMatchSnapshot();
    });
});
