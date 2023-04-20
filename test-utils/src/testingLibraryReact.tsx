import {
    render, queries, within, screen,
} from '@testing-library/react';
import customQueries from './customQueries';

// re-export some useful stuff for convenience
export * from '@testing-library/react';

const allQueries = {
    ...queries,
    ...customQueries,
};

const customScreen = { ...within(document.body, allQueries), debug: screen.debug, logTestingPlaygroundURL: screen.logTestingPlaygroundURL };
const customWithin = (element: HTMLElement) => within(element, allQueries);
const customRender = (ui: Parameters<typeof render>[0], options?: Parameters<typeof render>[1]) =>
    render(ui, { queries: allQueries, ...options });

export { customScreen as screen, customWithin as within, customRender as render };
