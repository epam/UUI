import React from 'react';
import { ModalBlocker, ModalHeader, ModalFooter, ModalWindow } from '../Modals';
import { fireEvent, renderSnapshotWithContextAsync, screen, setupComponentForTest } from '@epam/uui-test-utils';
import { IModal, ModalBlockerProps, useUuiContext } from '@epam/uui-core';
import { Button } from '../../buttons';
import { Modals } from '@epam/uui-components';

function TestElement(props?: ModalBlockerProps) {
    return (
        <ModalBlocker { ...props }>
            <ModalWindow>
                <ModalHeader borderBottom title="Modal header" onClose={ () => props.abort() } />
                <div id="modal-content">Test content</div>
                <ModalFooter>
                    <p>Modal footer text</p>
                </ModalFooter>
            </ModalWindow>
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

describe('Modals', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <ModalBlocker key="blocker" isActive zIndex={ 1 } abort={ jest.fn } success={ jest.fn }>
                <ModalWindow>
                    <ModalHeader />
                    <ModalFooter />
                </ModalWindow>
            </ModalBlocker>,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with many props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <ModalBlocker key="blocker" isActive zIndex={ 1 } abort={ jest.fn } success={ jest.fn } disallowClickOutside>
                <ModalWindow height={ 300 } width={ 300 } onClick={ jest.fn }>
                    <ModalHeader title="Test header" onClose={ jest.fn } borderBottom />
                    <ModalFooter borderTop />
                </ModalWindow>
            </ModalBlocker>,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render correctly children element', async () => {
        await setupModalBlocker({});

        const button = await screen.findByText('Show modal');
        // open ModalBlocker
        fireEvent.click(button);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();
    });

    it('should close when clicked outside with prop `disallowClickOutside: false`', async () => {
        await setupModalBlocker({ disallowClickOutside: false });

        const button = await screen.findByText('Show modal');
        // open ModalBlocker
        fireEvent.click(button);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();

        const modalBlocker = document.getElementsByClassName('uui-modal-blocker')[0];
        // close ModalBlocker
        fireEvent.click(modalBlocker);
        expect(screen.queryByText('Test content')).toBeNull();
    });

    it('should not close when clicked outside with prop `disallowClickOutside: true`', async () => {
        await setupModalBlocker({ disallowClickOutside: true });

        const button = await screen.findByText('Show modal');
        fireEvent.click(button);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();

        // try to close ModalBlocker by clicking at the start of the document
        fireEvent.mouseDown(document.documentElement, { clientX: 10, clientY: 10 });
        fireEvent.click(document.documentElement, { clientX: 10, clientY: 10 });

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should close when esc button is pressed with prop `disableCloseByEsc: false`', async () => {
        await setupModalBlocker({ disableCloseByEsc: false });

        const openModalButton = await screen.findByText('Show modal');
        fireEvent.click(openModalButton);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();

        const closeModalButton = await screen.findByLabelText('Close modal');
        fireEvent.click(closeModalButton);

        expect(screen.queryByText('Test content')).toBeNull();
    });

    it('should not close when esc key is pressed with prop `disableCloseByEsc: true`', async () => {
        await setupModalBlocker({ disableCloseByEsc: true });

        const button = await screen.findByText('Show modal');
        fireEvent.click(button);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();

        const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(escEvent);

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    // TODO: create test for 'disableCloseOnRouterChange' when our 'setupComponentForTest' be able listen routes
});
