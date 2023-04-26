import {
    render, queries, within, screen,
} from '@testing-library/react';
import customQueries from './customQueries';
import userEvent from '@testing-library/user-event';

// re-export some useful stuff for convenience
// eslint-disable-next-line import/export
export * from '@testing-library/react';

const allQueries = {
    ...queries,
    ...customQueries,
};

const customScreen = { ...within(document.body, allQueries), debug: screen.debug, logTestingPlaygroundURL: screen.logTestingPlaygroundURL };
const customWithin = (element: HTMLElement) => within(element, allQueries);
const customRender = (ui: Parameters<typeof render>[0], options?: Parameters<typeof render>[1]) =>
    render(ui, { queries: allQueries, ...options });

// eslint-disable-next-line import/export
export { userEvent, customScreen as screen, customWithin as within, customRender as render };
