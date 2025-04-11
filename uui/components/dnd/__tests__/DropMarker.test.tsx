import React from 'react';
import { render } from '@epam/uui-test-utils';
import { DropMarker } from '../DropMarker';

describe('DropMarker', () => {
    it('should be rendered correctly', () => {
        const mockEventHandlers: any = {};
        mockEventHandlers.onMouseDown = jest.fn();
        mockEventHandlers.onMouseEnter = jest.fn();
        mockEventHandlers.onMouseMove = jest.fn();
        mockEventHandlers.onMouseLeave = jest.fn();
        mockEventHandlers.onMouseUp = jest.fn();

        const { asFragment } = render(
            <DropMarker
                classNames={ ['test-class'] }
                eventHandlers={ mockEventHandlers }
                isDndInProgress
                isDraggable
                isDraggedOut
                isDraggedOver
                isDragGhost
                isDropAccepted
                position="top"
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
