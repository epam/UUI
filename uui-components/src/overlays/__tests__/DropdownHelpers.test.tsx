import { isInteractedOutsideDropdown } from '../DropdownHelpers';

describe('isInteractedOutsideDropdown', () => {
    let mockEvent: Partial<Event>;
    let stopNodes: HTMLElement[];

    beforeEach(() => {
        // Reset mocks before each test
        mockEvent = {
            composedPath: jest.fn(),
            type: 'click',
        };
        stopNodes = [
            document.createElement('div'),
            document.createElement('div'),
        ];
    });

    test('should return false when interaction is inside stop nodes', () => {
        const path = [stopNodes[0], document.body];
        (mockEvent.composedPath as jest.Mock).mockReturnValue(path);

        const result = isInteractedOutsideDropdown(mockEvent as Event, stopNodes);

        expect(result).toBe(false);
    });

    test('should return true when interaction is outside and no popper found', () => {
        const path = [document.createElement('div'), document.body];
        (mockEvent.composedPath as jest.Mock).mockReturnValue(path);

        stopNodes[0].style.zIndex = '100';

        const result = isInteractedOutsideDropdown(mockEvent as Event, stopNodes);

        expect(result).toBe(true);
    });

    test('should return false when interaction is on popper with higher z-index', () => {
        const popper = document.createElement('div');
        popper.classList.add('uui-popper');
        popper.style.zIndex = '200';

        const path = [popper, document.body];
        (mockEvent.composedPath as jest.Mock).mockReturnValue(path);
        Object.defineProperty(mockEvent, 'target', { value: popper, configurable: true });

        stopNodes[0].style.zIndex = '100';

        document.body.appendChild(popper); // Append popper to the body to ensure it is in the DOM

        const result = isInteractedOutsideDropdown(mockEvent as Event, stopNodes);

        expect(result).toBe(false);

        document.body.removeChild(popper); // Clean up the DOM
    });

    test('should return true when interaction is on popper with lower z-index', () => {
        const popper = document.createElement('div');
        popper.classList.add('uui-popper');
        popper.style.zIndex = '50';

        const path = [popper, document.body];
        (mockEvent.composedPath as jest.Mock).mockReturnValue(path);
        Object.defineProperty(mockEvent, 'target', { value: popper, configurable: true });

        stopNodes[0].style.zIndex = '100';

        const result = isInteractedOutsideDropdown(mockEvent as Event, stopNodes);

        expect(result).toBe(true);
    });

    test('should handle case when bodyNode is undefined', () => {
        const path = [document.createElement('div'), document.body];
        (mockEvent.composedPath as jest.Mock).mockReturnValue(path);

        const result = isInteractedOutsideDropdown(mockEvent as Event, []);

        expect(result).toBe(true);
    });
});
