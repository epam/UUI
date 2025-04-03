import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Dropdown, Panel, Text, DropdownContainer, FlexRow } from '@epam/uui';
import { offset, VirtualElement } from '@floating-ui/react';

export default function VirtualElementDropdownExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const latestMousePos = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    // Create a virtual element that positions the dropdown at mouse coordinates
    const virtualElement = useMemo<VirtualElement>(() => ({
        getBoundingClientRect: () => new DOMRect(
            mousePosition.x,
            mousePosition.y,
            1, // Small width to ensure proper positioning
            1, // Small height to ensure proper positioning
        ),
    }), [mousePosition.x, mousePosition.y]);

    const updateMousePosition = (newPos: { x: number, y: number }) => {
        latestMousePos.current = newPos;
        if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(() => {
                setMousePosition({ ...latestMousePos.current });
                animationFrameRef.current = 0;
            });
        }
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        updateMousePosition({ x: e.clientX, y: e.clientY });
    }, []);

    const handleClick = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Memoize the dropdown body content
    const dropdownBody = useMemo(() => (
        <DropdownContainer>
            <Panel shadow={ true } style={ { padding: 16 } }>
                <div style={ { display: 'flex', flexDirection: 'column', gap: 8 } }>
                    <Text size="none">Current Mouse Position:</Text>
                    <Text size="none">
                        X:
                        {mousePosition.x}
                    </Text>
                    <Text size="none">
                        Y:
                        {mousePosition.y}
                    </Text>
                </div>
            </Panel>
        </DropdownContainer>
    ), [mousePosition.x, mousePosition.y]);

    return (
        <div
            onMouseMove={ handleMouseMove }
            onMouseLeave={ handleMouseLeave }
            onClick={ handleClick }
            style={ { minHeight: 400, background: 'var(--uui-surface-higher)', cursor: 'pointer' } }
        >
            <FlexRow alignItems="center" justifyContent="center" padding="24">
                <Text>Click anywhere in this area to toggle dropdown</Text>
            </FlexRow>

            <Dropdown
                value={ isOpen }
                virtualTarget={ virtualElement }
                middleware={ [offset(24)] }
                placement="right"
                renderBody={ () => dropdownBody }
            />
        </div>
    );
}
