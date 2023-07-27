import React from 'react';
import { Avatar } from '../Avatar';
import { render, renderer, screen, fireEvent } from '@epam/uui-test-utils';

describe('Avatar', () => {
    it('should show stub if image is not reachable', () => {
        render(<Avatar img="not-existing.jpg" size="36" alt="Test avatar" />);
        const component: HTMLImageElement = screen.getByAltText('Test avatar');
        fireEvent.error(component);
        expect(component.src).toEqual('https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg');
    });

    it('should show stub when prop isLoading true', () => {
        render(<Avatar img="not-existing.jpg" size="36" alt="Test avatar" isLoading={ true } />);
        const component: HTMLImageElement = screen.getByAltText('Test avatar');
        expect(component.src).toEqual('https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg');
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
        const tree = renderer.create(<Avatar img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" size="36" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<Avatar img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" size="36" alt="Test avatar" isLoading={ true } />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
