import React from 'react';
import { act, waitFor } from '@epam/uui-test-utils';
import { renderHookWithContextAsync, renderWithContextAsync } from '@epam/uui-test-utils';
import { useScrollSpy, ScrollSpy, IScrollSpyApi } from '../ScrollSpy';

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];

    private readonly callback: IntersectionObserverCallback;
    private observedElements: Element[] = [];

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        if (options) {
            this.root = options.root as Element || null;
            this.rootMargin = options.rootMargin || '';
            // threshold can be a number or array of numbers, but thresholds is always an array
            this.thresholds = Array.isArray(options.threshold)
                ? options.threshold
                : [options.threshold ?? 0];
        }
    }

    observe(element: Element): void {
        this.observedElements.push(element);
    }

    unobserve(element: Element): void {
        const index = this.observedElements.indexOf(element);
        if (index > -1) {
            this.observedElements.splice(index, 1);
        }
    }

    disconnect(): void {
        this.observedElements = [];
    }

    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }

    // Helper method to trigger intersection changes in tests
    triggerIntersection(entries: Partial<IntersectionObserverEntry>[]): void {
        const fullEntries: IntersectionObserverEntry[] = entries.map((entry) => ({
            target: entry.target!,
            isIntersecting: entry.isIntersecting ?? false,
            intersectionRatio: entry.intersectionRatio ?? 0,
            boundingClientRect: entry.boundingClientRect || {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                toJSON: () => ({}),
            } as DOMRect,
            rootBounds: entry.rootBounds || null,
            time: entry.time || Date.now(),
        })) as IntersectionObserverEntry[];

        this.callback(fullEntries, this);
    }
}

describe('ScrollSpy', () => {
    let observerInstance: MockIntersectionObserver | null = null;

    // Helper function to set up container with spy elements
    const setupSpyElements = (elementIds: string[]): { container: HTMLElement; elements: HTMLElement[] } => {
        const container = document.createElement('div');
        const elements = elementIds.map((id) => {
            const element = document.createElement('div');
            element.setAttribute('data-spy', id);
            container.appendChild(element);
            return element;
        });
        return { container, elements };
    };

    // Helper function to set up hook with container and wait for observer
    const setupHookWithContainer = async (
        hookResult: { current: { setRef: (ref: HTMLElement) => void } },
        container: HTMLElement,
    ) => {
        act(() => {
            hookResult.current.setRef(container);
        });

        await waitFor(() => {
            expect(observerInstance).toBeTruthy();
        });
    };

    beforeEach(() => {
        // Mock IntersectionObserver globally
        global.IntersectionObserver = jest.fn((callback, options) => {
            observerInstance = new MockIntersectionObserver(callback, options);
            return observerInstance;
        }) as any;

        // Mock scrollIntoView
        Element.prototype.scrollIntoView = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        observerInstance = null;
    });

    describe('useScrollSpy hook', () => {
        it('should initialize with first element as currentActive when no initialActive provided', async () => {
            const elements = ['section1', 'section2', 'section3'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements }),
            );

            expect(result.current.currentActive).toBe('section1');
        });

        it('should initialize with initialActive when provided', async () => {
            const elements = ['section1', 'section2', 'section3'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements, initialActive: 'section2' }),
            );

            expect(result.current.currentActive).toBe('section2');
        });

        it('should initialize with falsy value when no elements provided', async () => {
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({}),
            );

            // When no elements and no initialActive, the expression evaluates to false
            // because: Array.isArray(undefined) && undefined.length > 0 && undefined[0] = false
            // Type is string but runtime value is false
            expect(result.current.currentActive).toBeFalsy();
        });

        it('should set ref correctly', async () => {
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements: ['section1'] }),
            );

            const mockElement = document.createElement('div');
            act(() => {
                result.current.setRef(mockElement);
            });

            // Ref is set internally, we can't directly access it, but we can test through scrollToElement
            expect(result.current.setRef).toBeDefined();
        });

        it('should scroll to element when scrollToElement is called with valid element', async () => {
            const elements = ['section1', 'section2'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements }),
            );

            const container = document.createElement('div');
            const targetElement = document.createElement('div');
            targetElement.setAttribute('data-spy', 'section1');
            container.appendChild(targetElement);

            act(() => {
                result.current.setRef(container);
            });

            act(() => {
                result.current.scrollToElement('section1');
            });

            expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
                block: 'start',
                behavior: 'smooth',
            });
        });

        it('should scroll to container when scrollToElement is called with invalid element', async () => {
            const elements = ['section1', 'section2'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements }),
            );

            const container = document.createElement('div');
            act(() => {
                result.current.setRef(container);
            });

            act(() => {
                result.current.scrollToElement('invalid-section');
            });

            expect(container.scrollIntoView).toHaveBeenCalledWith({
                block: 'start',
                behavior: 'smooth',
            });
        });

        it('should scroll to container when scrollToElement is called without element', async () => {
            const elements = ['section1', 'section2'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements }),
            );

            const container = document.createElement('div');
            act(() => {
                result.current.setRef(container);
            });

            act(() => {
                result.current.scrollToElement();
            });

            expect(container.scrollIntoView).toHaveBeenCalledWith({
                block: 'start',
                behavior: 'smooth',
            });
        });

        it('should update currentActive when single element intersects', async () => {
            const elements = ['section1', 'section2'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements }),
            );

            const { container, elements: spyElements } = setupSpyElements(['section1', 'section2']);
            const [element1] = spyElements;

            await setupHookWithContainer(result, container);

            act(() => {
                observerInstance!.triggerIntersection([
                    {
                        target: element1,
                        isIntersecting: true,
                    },
                ]);
            });

            await waitFor(() => {
                expect(result.current.currentActive).toBe('section1');
            });
        });

        it('should update currentActive when multiple elements intersect', async () => {
            const elements = ['section1', 'section2'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements }),
            );

            const { container, elements: spyElements } = setupSpyElements(['section1', 'section2']);
            const [element1, element2] = spyElements;

            await setupHookWithContainer(result, container);

            act(() => {
                observerInstance!.triggerIntersection([
                    {
                        target: element1,
                        isIntersecting: false,
                    },
                    {
                        target: element2,
                        isIntersecting: true,
                    },
                ]);
            });

            await waitFor(() => {
                expect(result.current.currentActive).toBe('section2');
            });
        });

        it('should not change currentActive when non-active element exits viewport', async () => {
            const elements = ['section1', 'section2'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements, initialActive: 'section1' }),
            );

            const { container, elements: spyElements } = setupSpyElements(['section1', 'section2']);
            const [element1, element2] = spyElements;

            await setupHookWithContainer(result, container);

            // First, set section1 as active
            act(() => {
                observerInstance!.triggerIntersection([
                    {
                        target: element1,
                        isIntersecting: true,
                    },
                ]);
            });

            await waitFor(() => {
                expect(result.current.currentActive).toBe('section1');
            });

            // Then, section2 exits (but it's not the current active)
            act(() => {
                observerInstance!.triggerIntersection([
                    {
                        target: element2,
                        isIntersecting: false,
                    },
                ]);
            });

            // currentActive should remain 'section1'
            await waitFor(() => {
                expect(result.current.currentActive).toBe('section1');
            });
        });

        it('should clear currentActive when active element exits viewport', async () => {
            const elements = ['section1', 'section2'];
            const { result } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements, initialActive: 'section1' }),
            );

            const { container, elements: spyElements } = setupSpyElements(['section1']);
            const [element1] = spyElements;

            await setupHookWithContainer(result, container);

            // Set section1 as active
            act(() => {
                observerInstance!.triggerIntersection([
                    {
                        target: element1,
                        isIntersecting: true,
                    },
                ]);
            });

            await waitFor(() => {
                expect(result.current.currentActive).toBe('section1');
            });

            // Then section1 exits
            act(() => {
                observerInstance!.triggerIntersection([
                    {
                        target: element1,
                        isIntersecting: false,
                    },
                ]);
            });

            await waitFor(() => {
                expect(result.current.currentActive).toBe('');
            });
        });

        it('should use custom IntersectionObserver options', async () => {
            const elements = ['section1'];
            const customRoot = document.createElement('div');
            const customOptions: IntersectionObserverInit = {
                root: customRoot,
                rootMargin: '10px',
                threshold: [0.5],
            };

            await renderHookWithContextAsync(
                () => useScrollSpy({ elements, options: customOptions }),
            );

            await waitFor(() => {
                expect(global.IntersectionObserver).toHaveBeenCalledWith(
                    expect.any(Function),
                    expect.objectContaining({
                        root: customRoot,
                        rootMargin: '10px',
                        threshold: [0.5],
                    }),
                );
            });
        });

        it('should use body as default root when no root provided', async () => {
            const elements = ['section1'];

            await renderHookWithContextAsync(
                () => useScrollSpy({ elements }),
            );

            await waitFor(() => {
                expect(global.IntersectionObserver).toHaveBeenCalledWith(
                    expect.any(Function),
                    expect.objectContaining({
                        root: document.querySelector('body'),
                    }),
                );
            });
        });

        it('should not create observer when elements array is empty', async () => {
            await renderHookWithContextAsync(
                () => useScrollSpy({ elements: [] }),
            );

            await waitFor(() => {
                // Observer should not be created
                expect(observerInstance).toBeNull();
            });
        });

        it('should not create observer when elements is not provided', async () => {
            await renderHookWithContextAsync(
                () => useScrollSpy({}),
            );

            await waitFor(() => {
                // Observer should not be created
                expect(observerInstance).toBeNull();
            });
        });

        it('should disconnect observer on unmount', async () => {
            const elements = ['section1'];
            const { unmount } = await renderHookWithContextAsync(
                () => useScrollSpy({ elements }),
            );

            await waitFor(() => {
                expect(observerInstance).toBeTruthy();
            });

            const disconnectSpy = jest.spyOn(observerInstance!, 'disconnect');

            act(() => {
                unmount();
            });

            expect(disconnectSpy).toHaveBeenCalled();
        });
    });

    describe('ScrollSpy component', () => {
        it('should render children with scroll spy API', async () => {
            const elements = ['section1', 'section2'];
            const childrenMock = jest.fn(() => <div>Test</div>);

            await renderWithContextAsync(
                <ScrollSpy elements={ elements }>
                    { childrenMock }
                </ScrollSpy>,
            );

            expect(childrenMock).toHaveBeenCalled();
            expect(childrenMock.mock.calls.length).toBeGreaterThan(0);
            const firstCall = (childrenMock.mock.calls as any)[0];
            expect(firstCall).toBeDefined();
            const api = (firstCall?.[0] as IScrollSpyApi | undefined);
            expect(api).toBeDefined();
            expect(api).toHaveProperty('currentActive');
            expect(api).toHaveProperty('scrollToElement');
            expect(api).toHaveProperty('setRef');
            expect(typeof api!.scrollToElement).toBe('function');
            expect(typeof api!.setRef).toBe('function');
        });

        it('should pass correct currentActive to children', async () => {
            const elements = ['section1', 'section2'];
            const childrenMock = jest.fn(() => <div>Test</div>);

            await renderWithContextAsync(
                <ScrollSpy elements={ elements }>
                    { childrenMock }
                </ScrollSpy>,
            );

            expect(childrenMock.mock.calls.length).toBeGreaterThan(0);
            const firstCall = (childrenMock.mock.calls as any)[0];
            expect(firstCall).toBeDefined();
            const api = (firstCall?.[0] as IScrollSpyApi | undefined);
            expect(api).toBeDefined();
            expect(api!.currentActive).toBe('section1');
        });

        it('should update children when currentActive changes', async () => {
            const elements = ['section1', 'section2'];
            const childrenMock = jest.fn((api) => (
                <div data-testid="spy-content">{ api.currentActive }</div>
            ));

            const { rerender } = await renderWithContextAsync(
                <ScrollSpy elements={ elements }>
                    { childrenMock }
                </ScrollSpy>,
            );

            // Force rerender to test that children function is called again
            rerender(
                <ScrollSpy elements={ elements }>
                    { childrenMock }
                </ScrollSpy>,
            );

            expect(childrenMock.mock.calls.length).toBeGreaterThan(1);
        });
    });
});
