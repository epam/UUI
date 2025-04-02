import React from 'react';
import { Avatar } from '../Avatar';
import { render, screen, fireEvent } from '@epam/uui-test-utils';

describe('Avatar', () => {
    it('should show stub if image is not reachable', () => {
        render(<Avatar img="not-existing.jpg" size="36" alt="Test avatar" />);
        const component: HTMLImageElement = screen.getByAltText('Test avatar');
        fireEvent.error(component);
        expect(component.src).toEqual('https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/icons/avatar_placeholder.svg');
    });

    it('should show stub when prop isLoading true', () => {
        render(<Avatar img="not-existing.jpg" size="36" alt="Test avatar" isLoading={ true } />);
        const component: HTMLImageElement = screen.getByAltText('Test avatar');
        expect(component.src).toEqual('https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/icons/avatar_placeholder.svg');
    });

    it("shouldn't call internal onError if there is onError in rawProps", () => {
        const mockOnError = jest.fn(() => undefined);
        render(<Avatar img="https://static.cdn.epam.com/" size="36" alt="Test avatar" rawProps={ { onError: mockOnError } } />);
        const component: HTMLImageElement = screen.getByAltText('Test avatar');
        fireEvent.error(component);
        expect(component.src).toEqual('https://static.cdn.epam.com/');
        expect(mockOnError).toHaveBeenCalled();
    });

    it('should be rendered correctly', () => {
        const { asFragment } = render(<Avatar img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" size="36" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const { asFragment } = render(<Avatar img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" size="36" alt="Test avatar" isLoading={ true } />);
        expect(asFragment()).toMatchSnapshot();
    });
});
