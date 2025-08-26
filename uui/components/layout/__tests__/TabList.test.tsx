import { renderWithContextAsync, screen, userEvent, within } from '@epam/uui-test-utils';
import { type TabListItemProps, TabList } from '../TabList';

const tab1: TabListItemProps = {
    id: 'tab-1',
    caption: 'Tab 1',
};

const tab2: TabListItemProps = {
    id: 'tab-2',
    caption: 'Tab 2',
};

const items: Array<TabListItemProps> = [
    tab1,
    tab2,
    {
        id: 'tab-3',
        caption: 'Tab 3',
    },
];

describe('static rendering', () => {
    test('sets correct aria-orientation and role to tab list', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-1"
                onValueChange={ jest.fn() }
            />,
        );

        const tablist = screen.getByRole('tablist');

        expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
    });

    test('renders nothing if items array is empty', async () => {
        await renderWithContextAsync(
            <TabList
                items={ [] }
                value="tab-1"
                onValueChange={ jest.fn() }
            />,
        );

        const tablist = screen.queryByRole('tablist');

        expect(tablist).not.toBeInTheDocument();
    });

    test('sets id to tab', async () => {
        await renderWithContextAsync(
            <TabList
                items={ [
                    tab1,
                    tab2,
                ] }
                value="tab"
                onValueChange={ jest.fn() }
            />,
        );

        const tablist = screen.getByRole('tablist');
        const tabs = within(tablist).getAllByRole('tab');

        expect(tabs.at(0)).toHaveAttribute('id', tab1.id);
        expect(tabs.at(1)).toHaveAttribute('id', tab2.id);
    });

    test("renders inactive tabs if value doesn't match any tab id", async () => {
        await renderWithContextAsync(
            <TabList
                items={ [
                    tab1,
                    tab2,
                ] }
                value="tab"
                onValueChange={ jest.fn() }
            />,
        );

        const tablist = screen.getByRole('tablist');
        const tabs = within(tablist).getAllByRole('tab');
        expect(tabs.at(0)).toHaveAttribute('aria-selected', 'false');
        expect(tabs.at(0)).toHaveAttribute('tabindex', '-1');
        expect(tabs.at(1)).toHaveAttribute('aria-selected', 'false');
        expect(tabs.at(1)).toHaveAttribute('tabindex', '-1');
    });

    test('renders tabs with one of them selected', async () => {
        await renderWithContextAsync(
            <TabList
                items={ [
                    tab1,
                    tab2,
                ] }
                value="tab-1"
                onValueChange={ jest.fn() }
            />,
        );

        const tablist = screen.getByRole('tablist');
        const tabs = within(tablist).getAllByRole('tab');
        expect(tabs.at(0)).toHaveAttribute('aria-selected', 'true');
        expect(tabs.at(0)).toHaveAttribute('tabindex', '0');
        expect(tabs.at(1)).toHaveAttribute('aria-selected', 'false');
        expect(tabs.at(1)).toHaveAttribute('tabindex', '-1');
    });
});

describe('focus managements', () => {
    test('focuses on an active tab when pressing Tab', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-1"
                onValueChange={ jest.fn() }
            />,
        );

        const tab = screen.getByRole('tab', { name: /tab 1/i });
        // Focus is initially on `body`.
        expect(tab).not.toHaveFocus();

        await userEvent.tab();
        expect(tab).toHaveFocus();
    });

    test("moves focus to the first tab when 'Home' key is pressed", async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-2"
                onValueChange={ jest.fn() }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 2/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{Home}');
        const activeTabNext = screen.getByRole('tab', { name: /tab 1/i });
        expect(activeTabNext).toHaveFocus();
    });

    test("moves focus to the last tab when 'End' key is pressed", async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-2"
                onValueChange={ jest.fn() }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 2/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{End}');
        const activeTabNext = screen.getByRole('tab', { name: /tab 3/i });
        expect(activeTabNext).toHaveFocus();
    });

    test('moves focus to the next tab when right arrow key is pressed', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-2"
                onValueChange={ jest.fn() }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 2/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{ArrowRight}');
        const activeTabNext = screen.getByRole('tab', { name: /tab 3/i });
        expect(activeTabNext).toHaveFocus();
    });

    test('moves focus to the next tab when left arrow key is pressed', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-2"
                onValueChange={ jest.fn() }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 2/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{ArrowLeft}');
        const activeTabNext = screen.getByRole('tab', { name: /tab 1/i });
        expect(activeTabNext).toHaveFocus();
    });

    test('moves focus to the first tab when the last tab is focused and right arrow key is pressed', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-3"
                onValueChange={ jest.fn() }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 3/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{ArrowRight}');
        const activeTabNext = screen.getByRole('tab', { name: /tab 1/i });
        expect(activeTabNext).toHaveFocus();
    });

    test('moves focus to the last tab when the first tab is focused and left arrow key is pressed', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-1"
                onValueChange={ jest.fn() }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 1/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{ArrowLeft}');
        const activeTabNext = screen.getByRole('tab', { name: /tab 3/i });
        expect(activeTabNext).toHaveFocus();
    });

    test('calls a custom `onKeyDown` callback', async () => {
        const onKeyDown = jest.fn();
        await renderWithContextAsync(
            <TabList
                items={ [
                    {
                        ...tab1,
                        rawProps: {
                            onKeyDown,
                        },
                    },
                    tab2,
                ] }
                value="tab-1"
                onValueChange={ jest.fn() }
            />,
        );

        await userEvent.tab();
        await userEvent.keyboard('{ArrowRight}');
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 2/i });
        expect(activeTabCurrent).toHaveFocus();
        expect(onKeyDown).toBeCalled();
    });
});

describe('tab activation', () => {
    test('calls correct event handlers when Enter key is pressed on a focused tab (button)', async () => {
        const onValueChange = jest.fn();
        const onClick = jest.fn();
        const onKeyDown = jest.fn();
        await renderWithContextAsync(
            <TabList
                items={ [
                    tab1,
                    {
                        ...tab2,
                        onClick,
                        rawProps: {
                            onKeyDown,
                        },
                    },
                ] }
                value="tab-1"
                onValueChange={ onValueChange }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 1/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard('{Enter}');
        expect(onValueChange).toBeCalledWith('tab-2');
        expect(onClick).toBeCalled();
        expect(onKeyDown).toBeCalled();
    });

    test('calls correct event handlers when Space key is pressed on a focused tab (button)', async () => {
        const onValueChange = jest.fn();
        const onClick = jest.fn();
        const onKeyDown = jest.fn();
        await renderWithContextAsync(
            <TabList
                items={ [
                    tab1,
                    {
                        ...tab2,
                        onClick,
                        rawProps: {
                            onKeyDown,
                        },
                    },
                ] }
                value="tab-1"
                onValueChange={ onValueChange }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 1/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard(' ');
        expect(onValueChange).toBeCalledWith('tab-2');
        expect(onClick).toBeCalled();
        expect(onKeyDown).toBeCalled();
    });

    test('calls correct event handlers when Enter key is pressed on a focused tab (link)', async () => {
        const onValueChange = jest.fn();
        const onClick = jest.fn();
        const onKeyDown = jest.fn();
        await renderWithContextAsync(
            <TabList
                items={ [
                    {
                        ...tab1,
                        link: {
                            pathname: '/',
                            query: {
                                tabId: 'tab-1',
                            },
                        },
                    },
                    {
                        ...tab2,
                        link: {
                            pathname: '/',
                            query: {
                                tabId: 'tab-2',
                            },
                        },
                        onClick,
                        rawProps: {
                            onKeyDown,
                        },
                    },
                ] }
                value="tab-1"
                onValueChange={ onValueChange }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 1/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard('{Enter}');
        expect(onValueChange).toBeCalledWith('tab-2');
        expect(onClick).toBeCalled();
        expect(onKeyDown).toBeCalled();
    });

    test('calls correct event handlers when Space key is pressed on a focused tab (link)', async () => {
        const onValueChange = jest.fn();
        const onClick = jest.fn();
        const onKeyDown = jest.fn();
        await renderWithContextAsync(
            <TabList
                items={ [
                    {
                        ...tab1,
                        link: {
                            pathname: '/',
                            query: {
                                tabId: 'tab-1',
                            },
                        },
                    },
                    {
                        ...tab2,
                        link: {
                            pathname: '/',
                            query: {
                                tabId: 'tab-2',
                            },
                        },
                        onClick,
                        rawProps: {
                            onKeyDown,
                        },
                    },
                ] }
                value="tab-1"
                onValueChange={ onValueChange }
            />,
        );

        await userEvent.tab();
        const activeTabCurrent = screen.getByRole('tab', { name: /tab 1/i });
        expect(activeTabCurrent).toHaveFocus();

        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard(' ');
        expect(onValueChange).toBeCalledWith('tab-2');
        expect(onClick).toBeCalled();
        expect(onKeyDown).toBeCalled();
    });
});

describe('customization', () => {
    test('sets custom raw props to tab list', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-1"
                onValueChange={ jest.fn() }
                rawProps={ {
                    'data-testid': 'tablist-data-testid',
                } }
            />,
        );

        const tablistByRole = screen.getByRole('tablist');
        expect(tablistByRole).toBeInTheDocument();

        const tablistByTestId = screen.getByTestId('tablist-data-testid');
        expect(tablistByTestId).toBeInTheDocument();
        expect(tablistByRole).toBe(tablistByTestId);
    });

    test('sets a custom class to tab list', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-1"
                onValueChange={ jest.fn() }
                cx="custom-class"
            />,
        );

        const tablist = screen.getByRole('tablist');

        expect(tablist).toBeInTheDocument();
        expect(tablist).toHaveClass('custom-class');
    });

    test('replaces default attributes in tab list', async () => {
        await renderWithContextAsync(
            <TabList
                items={ items }
                value="tab-1"
                onValueChange={ jest.fn() }
                rawProps={ {
                    role: 'custom-role',
                    'aria-orientation': 'vertical',
                } }
            />,
        );

        const tablist = screen.getByRole('custom-role');

        expect(tablist).toBeInTheDocument();
        expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    });

    test('replaces default attributes in tab', async () => {
        await renderWithContextAsync(
            <TabList
                items={ [
                    {
                        ...tab1,
                        isActive: false,
                        tabIndex: 2,
                        rawProps: {
                            id: '123',
                            role: 'custom-role',
                            'aria-selected': 'false',
                        },
                    },
                ] }
                value="tab-1"
                onValueChange={ jest.fn() }
            />,
        );

        const tablist = screen.getByRole('custom-role');

        expect(tablist).toBeInTheDocument();
        expect(tablist).not.toHaveClass('uui-active');
        expect(tablist).toHaveAttribute('tabindex', '2');
        expect(tablist).toHaveAttribute('id', '123');
        expect(tablist).toHaveAttribute('aria-selected', 'false');
    });
});
