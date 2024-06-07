import React from 'react';
import { fireEvent, screen, setupComponentForTest } from '@epam/uui-test-utils';
import { IModal, ModalBlockerProps, useUuiContext } from '@epam/uui-core';
import { Button } from '../../buttons';
import { ModalBlocker, ModalHeader } from '@epam/uui';
import { Modals } from '@epam/uui-components';

function TestElement(props: ModalBlockerProps) {
    return (
        <ModalBlocker { ...props }>
            <ModalHeader borderBottom title="Modal header" onClose={ () => props.abort() } />
            <div id="modal-content">Test content</div>
        </ModalBlocker>
    );
}

const handleModalOpening = (props: IModal<string> & ModalBlockerProps) => <TestElement { ...props } />;

async function setupModalBlocker(params: Partial<ModalBlockerProps>) {
    const { setProps, mocks } = await setupComponentForTest<ModalBlockerProps>(
        () => {
            const props: ModalBlockerProps = {
                disableFocusLock: params.disableFocusLock || false,
                disableCloseByEsc: params.disableCloseByEsc || false,
                disallowClickOutside: params.disallowClickOutside || false,
                disableCloseOnRouterChange: params.disableCloseOnRouterChange || false,
                abort: jest.fn(),
                success: jest.fn(),
                key: params.key || 'modal_key',
                zIndex: params.zIndex || 1,
            };
            return props;
        },
        () => {
            const { uuiModals } = useUuiContext();
            return (
                <div>
                    <Button
                        caption="Show modal"
                        onClick={
                            async () => {
                                try {
                                    return await uuiModals
                                        .show(handleModalOpening);
                                } catch {
                                }
                            }
                        }
                    />
                    <Modals />
                </div>
            );
        },
    );
    const wrapper = screen.queryByTestId('modal-wrapper') as HTMLDivElement;

    const dom = { wrapper };
    return {
        setProps,
        mocks,
        dom,
    };
}

describe('ModalBlocker', () => {
    it('should render correctly', async () => {
        await setupModalBlocker({});

        const button = await screen.findByText('Show modal');
        // open ModalBlocker
        fireEvent.click(button);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();
    });

    it('should close when esc button is pressed', async () => {
        await setupModalBlocker({ disableCloseByEsc: false });

        const openModalButton = await screen.findByText('Show modal');
        fireEvent.click(openModalButton);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();

        const closeModalButton = await screen.findByLabelText('Close modal');
        fireEvent.click(closeModalButton);

        expect(screen.queryByText('Test content')).toBeNull();
    });
});
