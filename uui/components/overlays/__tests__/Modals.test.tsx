import React, { ReactNode, useState } from 'react';
import { ModalBlocker, ModalHeader, ModalFooter, ModalWindow } from '../Modals';
import { fireEvent, getDefaultUUiContextWrapper, renderSnapshotWithContextAsync, renderWithContextAsync, screen, setupComponentForTest, userEvent } from '@epam/uui-test-utils';
import { IModal, ModalBlockerProps, useArrayDataSource, useUuiContext } from '@epam/uui-core';
import { Button } from '../../buttons';
import { Modals } from '@epam/uui-components';
import { PickerInput } from '../../pickers';
import { Panel } from '../../layout';
import { Text } from '../../typography';

function TestElement(props: ModalBlockerProps) {
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
            <ModalBlocker key="blocker" zIndex={ 1 } abort={ jest.fn } success={ jest.fn }>
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
            <ModalBlocker key="blocker" zIndex={ 1 } abort={ jest.fn } success={ jest.fn } disallowClickOutside>
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

    it('should properly handle closing picker input\'s options and modal window on \'Escape\' key presses', async () => {
        const successMock = jest.fn();
        const abortMock = jest.fn();
        const { wrapper, testUuiCtx } = getDefaultUUiContextWrapper();

        function ModalWindowWithPickerInput(
            props: IModal<undefined>,
        ) {
            interface Option {
                id: string;
                name: string;
            }

            const [
                option,
                setOption,
            ] = useState<Option | undefined>(undefined);

            const dataSource = useArrayDataSource<
            Option,
            Option['id'] | undefined,
            unknown
            >(
                {
                    items: [
                        {
                            id: 'option-1',
                            name: 'Option 1',
                        },
                        {
                            id: 'option-2',
                            name: 'Option 2',
                        },
                    ],
                },
                [],
            );

            return (
                <ModalBlocker
                    { ...props }
                >
                    <ModalWindow>
                        <PickerInput
                            dataSource={ dataSource }
                            value={ option }
                            onValueChange={ setOption }
                            selectionMode="single"
                            valueType="entity"
                        />
                    </ModalWindow>
                </ModalBlocker>
            );
        }

        function TestComponent(): ReactNode {
            const handleOpenModalWindow = async (): Promise<void> => {
                try {
                    await testUuiCtx.uuiModals.show((
                        modalWindowProps,
                    ) => {
                        return (
                            <ModalWindowWithPickerInput
                                { ...modalWindowProps }
                                success={ successMock.mockImplementation(modalWindowProps.success) }
                                abort={ abortMock.mockImplementation(modalWindowProps.abort) }
                            />
                        );
                    });
                } catch {}
            };

            return (
                <>
                    <Button
                        caption="Open modal window"
                        onClick={ handleOpenModalWindow }
                    />
                    <Modals />
                </>
            );
        }

        await renderWithContextAsync(
            <TestComponent />,
            {
                wrapper,
            },
        );

        const openModalWindowButton = await screen.findByRole(
            'button',
            {
                name: /open modal window/i,
            },
        );
        await userEvent.click(openModalWindowButton);
        const pickerInput = await screen.findByRole('searchbox');
        expect(pickerInput).toBeInTheDocument();

        await userEvent.click(pickerInput);
        // Checking that picker input's body is opened.
        expect(
            await screen.findByRole(
                'option',
                {
                    name: /option 1/i,
                },
            ),
        ).toBeVisible();

        // First 'Escape' key press should close the picker input's options.
        await userEvent.keyboard('{Escape}');
        // Checking that picker input's body is closed.
        expect(
            screen.queryByRole(
                'option',
                {
                    name: /option 1/i,
                },
            ),
        ).not.toBeInTheDocument();
        expect(pickerInput).toBeInTheDocument();
        expect(successMock).not.toBeCalled();
        expect(abortMock).not.toBeCalled();

        // Second 'Escape' key press should close the modal window.
        await userEvent.keyboard('{Escape}');
        expect(
            screen.queryByRole('searchbox'),
        ).not.toBeInTheDocument();
        expect(successMock).not.toBeCalled();
        expect(abortMock).toBeCalled();
    });

    it('should only close the topmost modal when ESC is pressed with nested modals', async () => {
        const { wrapper, testUuiCtx } = getDefaultUUiContextWrapper();

        function FirstModal(props: IModal<string>) {
            const openSecondModal = async () => {
                try {
                    await testUuiCtx.uuiModals.show((secondModalProps) => (
                        <SecondModal { ...secondModalProps } />
                    ));
                } catch {}
            };

            return (
                <ModalBlocker { ...props }>
                    <ModalWindow>
                        <Panel>
                            <Text>First Modal</Text>
                            <Button caption="Open 2 Modal" onClick={ openSecondModal } />
                        </Panel>
                    </ModalWindow>
                </ModalBlocker>
            );
        }

        function SecondModal(props: IModal<string>) {
            return (
                <ModalBlocker { ...props }>
                    <ModalWindow>
                        <Panel>
                            <Text>Second Modal</Text>
                        </Panel>
                    </ModalWindow>
                </ModalBlocker>
            );
        }

        function TestComponent(): ReactNode {
            const handleOpenFirstModal = testUuiCtx.uuiModals.show((modalProps) => (
                <FirstModal { ...modalProps } />
            ));

            return (
                <>
                    <Button caption="Open 1 Modal" onClick={ () => handleOpenFirstModal } />
                    <Modals />
                </>
            );
        }

        await renderWithContextAsync(<TestComponent />, { wrapper });

        // Open first modal
        const openFirstModalButton = await screen.findByRole('button', { name: /open 1 modal/i });
        await userEvent.click(openFirstModalButton);

        expect(await screen.findByText('First Modal')).toBeInTheDocument();

        // Open second modal from first modal
        const openSecondModalButton = await screen.findByRole('button', { name: /open 2 modal/i });
        await userEvent.click(openSecondModalButton);

        expect(await screen.findByText('Second Modal')).toBeInTheDocument();
        expect(await screen.findByText('First Modal')).toBeInTheDocument();

        // Press ESC - should only close the second (topmost) modal
        await userEvent.keyboard('{Escape}');

        expect(screen.queryByText('Second Modal')).not.toBeInTheDocument();
        expect(await screen.findByText('First Modal')).toBeInTheDocument();
    });

    // TODO: create test for 'disableCloseOnRouterChange' when our 'setupComponentForTest' be able listen routes
});
