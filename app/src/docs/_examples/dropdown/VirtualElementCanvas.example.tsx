import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Dropdown, DropdownContainer, Text, FlexRow, FlexCell } from '@epam/uui';
import { offset, VirtualElement } from '@floating-ui/react';

export default function CanvasDropdownExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [canvasPoint, setCanvasPoint] = useState({ x: 150, y: 100 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const lastUpdateRef = useRef<number>(0);

    // Virtual element positioned at the current mouse point on canvas
    const virtualElement = useMemo<VirtualElement>(() => ({
        getBoundingClientRect: () => {
            if (!canvasRef.current) {
                return new DOMRect(0, 0, 0, 0);
            }

            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            // Calculate position with scale consideration
            const x = rect.left + (canvasPoint.x / scaleX);
            const y = rect.top + (canvasPoint.y / scaleY);

            // Create a small rect at the cursor position
            const virtualRect = new DOMRect(
                x,
                y,
                1,
                1,
            );

            // Debug log position updates (throttled)
            const now = Date.now();
            if (now - lastUpdateRef.current > 100) { // Log every 100ms
                lastUpdateRef.current = now;
            }

            return virtualRect;
        },
    }), [canvasPoint]);

    // Draw canvas function
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear and fill background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw crosshair
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, canvasPoint.y);
        ctx.lineTo(canvas.width, canvasPoint.y);
        ctx.stroke();

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(canvasPoint.x, 0);
        ctx.lineTo(canvasPoint.x, canvas.height);
        ctx.stroke();

        // Center point
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(canvasPoint.x, canvasPoint.y, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Request next frame
        requestRef.current = requestAnimationFrame(drawCanvas);
    }, [canvasPoint]);

    // Initialize canvas animation
    useEffect(() => {
        requestRef.current = requestAnimationFrame(drawCanvas);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [drawCanvas]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        if (!rect) return;

        // Calculate position relative to canvas with scale consideration
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Ensure coordinates are within canvas bounds
        const boundedX = Math.max(0, Math.min(x, canvasRef.current.width));
        const boundedY = Math.max(0, Math.min(y, canvasRef.current.height));

        setCanvasPoint({ x: boundedX, y: boundedY });
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        setIsOpen(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        setIsOpen(false);
    }, []);

    // Memoize the dropdown body content
    const dropdownBody = useMemo(() => (
        <DropdownContainer maxWidth={ 280 }>
            <FlexRow padding="12">
                <Text>
                    Move your mouse over the canvas to see the dropdown follow your cursor and interact with the virtual element
                </Text>
            </FlexRow>
        </DropdownContainer>
    ), []);

    return (
        <div style={ { padding: 20 } }>
            <FlexRow>
                <FlexCell width={ 280 }>
                    <Text>
                        Move your mouse over the canvas to see the dropdown follow your cursor and interact with the virtual element
                    </Text>
                </FlexCell>
            </FlexRow>
            <canvas
                ref={ canvasRef }
                width={ 400 }
                height={ 200 }
                onMouseMove={ handleMouseMove }
                onMouseEnter={ handleMouseEnter }
                onMouseLeave={ handleMouseLeave }
                style={ {
                    border: '1px solid #ccc',
                    display: 'block',
                    margin: '20px 0',
                    cursor: 'crosshair',
                } }
            />

            <Dropdown
                value={ isOpen && isHovering }
                onValueChange={ setIsOpen }
                virtualTarget={ virtualElement }
                placement="top"
                middleware={ [offset(24)] }
                renderTarget={ () => null }
                renderBody={ () => dropdownBody }
            />
        </div>
    );
}
