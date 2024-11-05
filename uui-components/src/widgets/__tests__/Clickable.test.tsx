import * as React from 'react';
import { renderSnapshotWithContextAsync, fireEvent, screen, renderWithContextAsync } from '@epam/uui-test-utils';
import { Clickable } from '../Clickable';
import { uuiMarkers, uuiMod } from '@epam/uui-core';

describe('Clickable', () => {
    beforeEach(jest.clearAllMocks);
    afterAll(jest.resetAllMocks);

    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Clickable />);
        expect(tree).toMatchSnapshot();
    });

    it('renders as a button when onClick prop is provided', async () => {
        const onClick = jest.fn();
        await renderWithContextAsync(<Clickable onClick={ onClick } />);
        const buttonElement = screen.queryByRole('button');
        expect(buttonElement).toBeInTheDocument();
    });

    it('renders as an anchor when href prop is provided', async () => {
        await renderWithContextAsync(<Clickable href="test" />);
        const anchorElement = screen.queryByRole('link');
        expect(anchorElement).toBeInTheDocument();
    });

    it('renders as an anchor when link prop is provided', async () => {
        await renderWithContextAsync(<Clickable link={ { pathname: '/' } } />);
        const anchorElement = screen.queryByRole('link');
        expect(anchorElement).toBeInTheDocument();
    });

    it('renders as a span & is not clickable when neither onClick, href, nor link prop is provided', async () => {
        await renderWithContextAsync(<Clickable>test</Clickable>);
        const spanElement = screen.queryByText('test');
        expect(spanElement.nodeName).toBe('SPAN');
        expect(spanElement).not.toHaveClass('clickable');
    });

    it('is clickable when not disabled and either onClick, href, or link prop is provided & call onClick when clicked', async () => {
        const mockOnClick = jest.fn();
        await renderWithContextAsync(<Clickable onClick={ mockOnClick } />);
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(buttonElement).toHaveClass(uuiMarkers.clickable);
    });

    it('should call onClick when Clickable is clicked', async () => {
        const mockOnClick = jest.fn();
        await renderWithContextAsync(<Clickable onClick={ mockOnClick } />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger onClick if isDisabled is true', async () => {
        const onClick = jest.fn();
        await renderWithContextAsync(<Clickable onClick={ onClick } isDisabled />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('should redirect when link prop is set', async () => {
        const pathname = '/test';
        const mockRedirect = jest.fn();
        const mockCreateHref = jest.fn().mockReturnValue(pathname);
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            uuiRouter: {
                redirect: mockRedirect,
                isActive: jest.fn(),
                createHref: mockCreateHref,
            },
            uuiAnalytics: {
                sendEvent: jest.fn(),
            },
        }));
        await renderWithContextAsync(<Clickable link={ { pathname: pathname } } />);
        const anchorElement = screen.getByRole('link');
        expect(anchorElement.getAttribute('href')).toEqual(pathname);
        fireEvent.click(anchorElement);
        expect(mockRedirect).toHaveBeenCalled();
    });

    it('should not redirect when link prop is set, input checkbox passed as a child and checkbox clicked', async () => {
        const pathname = '/test';
        const mockRedirect = jest.fn();
        const mockCreateHref = jest.fn().mockReturnValue(pathname);
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            uuiRouter: {
                redirect: mockRedirect,
                isActive: jest.fn(),
                createHref: mockCreateHref,
            },
        }));

        // Added "-clickable" class to the component inside a Clickable to avoid redirection when the target is the nested component itself
        await renderWithContextAsync(
            <Clickable link={ { pathname: pathname } }>
                <input type="checkbox" data-testid="test-checkbox" className={ uuiMarkers.clickable } />
            </Clickable>,
        );
        const checkboxElement = screen.getByTestId('test-checkbox');
        expect(checkboxElement).toBeInTheDocument();
        const anchorElement = screen.getByRole('link');
        expect(anchorElement.getAttribute('href')).toEqual(pathname);
        fireEvent.click(checkboxElement);
        expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('should not redirect when link prop is set, button is passed as a child and button clicked', async () => {
        const pathname = '/test';
        const mockOnClick = jest.fn();
        const mockRedirect = jest.fn();
        const mockCreateHref = jest.fn().mockReturnValue(pathname);
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            uuiRouter: {
                redirect: mockRedirect,
                isActive: jest.fn(),
                createHref: mockCreateHref,
            },
        }));
        await renderWithContextAsync(
            <Clickable link={ { pathname: pathname } }>
                <button data-testid="test-button" className={ uuiMarkers.clickable } onClick={ mockOnClick } />
            </Clickable>,
        );
        const buttonElement = screen.getByTestId('test-button');
        expect(buttonElement).toBeInTheDocument();
        const anchorElement = screen.getByRole('link');
        expect(anchorElement.getAttribute('href')).toEqual(pathname);
        fireEvent.click(buttonElement);
        expect(mockOnClick).toHaveBeenCalled();
        expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('calls sendEvent when Clickable with onClick is clicked', async () => {
        const mockSendEvent = jest.fn();
        jest.spyOn(React, 'useContext').mockImplementation(
            () => ({
                uuiAnalytics: {
                    sendEvent: mockSendEvent,
                },
            }),
        );
        await renderWithContextAsync(<Clickable onClick={ jest.fn } clickAnalyticsEvent={ { name: 'click' } } />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockSendEvent).toHaveBeenCalledTimes(1);
        expect(mockSendEvent).toHaveBeenCalledWith({ name: 'click' });
    });

    it('calls sendEvent when Clickable with href is clicked', async () => {
        const mockSendEvent = jest.fn();
        jest.spyOn(React, 'useContext').mockImplementation(
            () => ({
                uuiAnalytics: {
                    sendEvent: mockSendEvent,
                },
            }),
        );
        await renderWithContextAsync(<Clickable href="#" clickAnalyticsEvent={ { name: 'click' } } />);
        fireEvent.click(screen.getByRole('link'));
        expect(mockSendEvent).toHaveBeenCalledTimes(1);
        expect(mockSendEvent).toHaveBeenCalledWith({ name: 'click' });
    });

    it('calls sendEvent when Clickable with link is clicked', async () => {
        const pathname = '#';
        const mockRedirect = jest.fn();
        const mockSendEvent = jest.fn();
        const mockCreateHref = jest.fn().mockReturnValue(pathname);
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            uuiRouter: {
                redirect: mockRedirect,
                isActive: jest.fn(),
                createHref: mockCreateHref,
            },
            uuiAnalytics: {
                sendEvent: mockSendEvent,
            },
        }));
        await renderWithContextAsync(<Clickable link={ { pathname } } clickAnalyticsEvent={ { name: 'click' } } />);
        fireEvent.click(screen.getByRole('link'));
        expect(mockSendEvent).toHaveBeenCalledTimes(1);
        expect(mockSendEvent).toHaveBeenCalledWith({ name: 'click' });
    });

    it('triggers form submission when type is "submit"', async () => {
        const mockOnSubmit = jest.fn();
        await renderWithContextAsync(
            <form onSubmit={ mockOnSubmit }>
                <Clickable type="button" rawProps={ { type: 'submit' } } />
            </form>,
        );

        fireEvent.submit(screen.getByRole('button'));
        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should add rel attribute to anchor element when href is provided & target equal _blank', async () => {
        await renderWithContextAsync(<Clickable href="test" target="_blank" />);

        const anchorElement = screen.getByRole('link');
        expect(anchorElement).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should applies any rel attribute via rawProps to anchor element when href is provided & target equal _blank (issue: https://github.com/epam/UUI/issues/1421)', async () => {
        await renderWithContextAsync(<Clickable href="test" target="_blank" rawProps={ { rel: 'nofollow' } } />);

        const anchorElement = screen.getByRole('link');
        expect(anchorElement).toHaveAttribute('rel', 'nofollow');
    });

    it('should not redirect when target equal _blank and link is not null', async () => {
        const pathname = '/test';
        const mockRedirect = jest.fn();
        const mockCreateHref = jest.fn().mockReturnValue(pathname);
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            uuiRouter: {
                redirect: mockRedirect,
                isActive: jest.fn(),
                createHref: mockCreateHref,
            },
            uuiAnalytics: {
                sendEvent: jest.fn(),
            },
        }));

        await renderWithContextAsync(<Clickable link={ { pathname } } target="_blank" />);
        const anchorElement = screen.getByRole('link');
        fireEvent.click(anchorElement);
        expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('should add active class when isLinkActive is true', async () => {
        const pathname = '/test';
        const mockCreateHref = jest.fn().mockReturnValue(pathname);
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            uuiRouter: {
                redirect: jest.fn(),
                isActive: jest.fn(),
                createHref: mockCreateHref,
            },
        }));
        await renderWithContextAsync(<Clickable link={ { pathname: pathname } } isLinkActive />);
        const clickableElement = screen.getByRole('link');
        expect(clickableElement).toHaveClass(uuiMod.active);
    });

    it('should not add active class when isLinkActive is false', async () => {
        const pathname = '/test';
        const mockCreateHref = jest.fn().mockReturnValue(pathname);
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            uuiRouter: {
                redirect: jest.fn(),
                isActive: jest.fn(),
                createHref: mockCreateHref,
            },
        }));
        await renderWithContextAsync(<Clickable link={ { pathname: pathname } } isLinkActive={ false } />);
        const clickableElement = screen.getByRole('link');
        expect(clickableElement).not.toHaveClass(uuiMod.active);
    });

    it('should add active class when isActive from context returns true', async () => {
        const pathname = '/test';
        const mockCreateHref = jest.fn().mockReturnValue(pathname);
        const mockIsActive = jest.fn().mockReturnValue(true);
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            uuiRouter: {
                redirect: jest.fn(),
                isActive: mockIsActive,
                createHref: mockCreateHref,
            },
        }));
        await renderWithContextAsync(<Clickable link={ { pathname: pathname } } />);
        const clickableElement = screen.getByRole('link');
        expect(clickableElement).toHaveClass(uuiMod.active);
    });

    it('should have tabIndex equal to passed prop', async () => {
        const onClick = jest.fn();
        await renderWithContextAsync(<Clickable onClick={ onClick } tabIndex={ 3 } />);
        expect(screen.getByRole('button').getAttribute('tabindex')).toBe('3');
    });

    it('should have tabIndex equals to -1 if clickable is disabled', async () => {
        await renderWithContextAsync(<Clickable isDisabled />);
        expect(screen.getByAria('disabled', 'true').getAttribute('tabindex')).toBe('-1');
    });

    it('pass through rawProps to the rendered element', async () => {
        const rawProps = { 'data-testid': 'test-raw-props' };
        await renderWithContextAsync(<Clickable rawProps={ rawProps } />);

        const clickableElement = screen.getByTestId('test-raw-props');
        expect(clickableElement).toBeInTheDocument();
    });

    it('applies cx to the rendered element', async () => {
        await renderWithContextAsync(<Clickable onClick={ jest.fn } cx="test-class" />);

        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveClass('test-class');
    });
});
