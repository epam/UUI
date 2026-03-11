export const createScrollContainer = ({ scrollTop, clientHeight }: { scrollTop?: number, clientHeight?: number } = {}) => {
    const scrollContainer = document.createElement('div');
    scrollContainer.scrollTop = scrollTop ?? scrollContainer.scrollTop;
    scrollContainer.style.height = '100px';
    jest.spyOn(scrollContainer, 'clientHeight', 'get')
        .mockImplementation(() => clientHeight ?? 0);
    return scrollContainer;
};

export interface CreateListContainerOptions {
    /** Vertical margin for each row (applied to top and bottom). Default 0. */
    rowMargin?: number;
}

export const createListContainer = (
    heights: number[],
    options: CreateListContainerOptions = {},
) => {
    const { rowMargin = 0 } = options;
    const listContainer = document.createElement('div');
    listContainer.style.height = '100%';

    document.body.appendChild(listContainer);

    heights.forEach((height) => {
        const element = document.createElement('div');
        element.setAttribute('role', 'row');
        element.textContent = `${height}`;
        element.style.height = `${height}px`;
        if (rowMargin > 0) {
            element.style.marginTop = `${rowMargin}px`;
            element.style.marginBottom = `${rowMargin}px`;
        }
        element.getBoundingClientRect = () => ({
            width: 0,
            height,
            right: 0,
            top: 0,
            left: 0,
            bottom: height,
            x: 0,
            y: 0,
            toJSON: () => '',
        });

        listContainer.appendChild(element);
    });

    return listContainer;
};
