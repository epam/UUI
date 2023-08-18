export const createScrollContainer = () => {
    return document.createElement('div');
};

export const createListContainer = (heights: number[]) => {
    const listContainer = document.createElement('div');
    listContainer.style.height = '100%';

    document.body.appendChild(listContainer);

    heights.forEach((height) => {
        const element = document.createElement('div');
        element.textContent = `${height}`;
        element.style.height = `${height}px`;
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
