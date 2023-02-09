import React from 'react';
import { DropMarker } from '../DropMarker';
import renderer from 'react-test-renderer';

describe('DropMarker', () => {
    it('should be rendered correctly', () => {
        const mockEventHandlers: any = {};
        mockEventHandlers.onMouseDown = jest.fn();
        mockEventHandlers.onMouseEnter = jest.fn();
        mockEventHandlers.onMouseMove = jest.fn();
        mockEventHandlers.onMouseLeave = jest.fn();
        mockEventHandlers.onMouseUp = jest.fn();

        const tree = renderer
            .create(<DropMarker
                classNames={ ['test-class'] }
                eventHandlers={ mockEventHandlers }
                isDndInProgress
                isDraggable
                isDraggedOut
                isDraggedOver
                isDragGhost
                isDropAccepted
                position='top'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});