import React from 'react';
import { fireEvent, screen, setupComponentForTest } from '@epam/uui-test-utils';
import { IModal, ModalBlockerProps, useUuiContext } from '@epam/uui-core';
import { Button } from '../../buttons';
import { Modals } from '../Modals';
import { ModalBlocker } from '../ModalBlocker';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

function TestElement(props: ModalBlockerProps) {
    return (
        <ModalBlocker { ...props }>
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
                    <Button
                        caption="Other route"
                        onClick={ () => history.push('/new-url') }
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
        const { dom } = await setupModalBlocker({});

        const button = await screen.findByText('Show modal');
        // open ModalBlocker
        fireEvent.click(button);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();
        expect(dom.wrapper).toMatchSnapshot();
    });

    it('should close when clicked outside', async () => {
        await setupModalBlocker({});

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

    it('should not close when esc key is pressed', async () => {
        await setupModalBlocker({ disableCloseByEsc: true });

        const button = await screen.findByText('Show modal');
        fireEvent.click(button);

        const testElement = await screen.findByText('Test content');
        expect(testElement).toBeInTheDocument();

        const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(escEvent);

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should not close when clicked outside', async () => {
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

    it('should not close when router changes', async () => {
        await setupModalBlocker({ disableCloseOnRouterChange: true });

        fireEvent.click(await screen.findByText('Show modal'));
        expect(await screen.findByText('Test content')).toBeInTheDocument();

        const button = screen.getByText('Other route');
        fireEvent.click(button);

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should close when router changes', async () => {
        await setupModalBlocker({ disableCloseOnRouterChange: false });

        fireEvent.click(await screen.findByText('Show modal'));
        expect(await screen.findByText('Test content')).toBeInTheDocument();

        const button = screen.getByText('Other route');
        fireEvent.click(button);

        expect(screen.queryByText('Test content')).toBeNull();
    });
});
