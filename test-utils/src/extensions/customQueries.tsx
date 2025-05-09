import { buildQueries, within } from '@testing-library/react';

function queryAllByRoleAndText(container: HTMLElement, params: { role: string, text: string | RegExp }) {
    const arr = within(container).queryAllByRole(params.role);
    return arr.filter((e) => {
        if (params.text instanceof RegExp) {
            return params.text.test(e.textContent?.trim());
        }
        return e.textContent?.trim() === params.text;
    });
}

function queryAllByAria(container: HTMLElement, name: string, value: string) {
    const arr = container.querySelectorAll(`[aria-${name}='${value}']`);
    return [...arr] as HTMLElement[];
}

function buildQueryByRoleAndText() {
    const [
        queryByRoleAndText, getAllByRoleAndText, getByRoleAndText, findAllByRoleAndText, findByRoleAndText,
    ] = buildQueries(
        queryAllByRoleAndText,
        (c, { role, text }) => `Found multiple elements with role=${role} and text=${text}`,
        (c, { role, text }) => `Unable to find an element with role=${role} and text=${text}`,
    );

    return {
        queryAllByRoleAndText,
        queryByRoleAndText,
        getAllByRoleAndText,
        getByRoleAndText,
        findAllByRoleAndText,
        findByRoleAndText,
    };
}

function buildQueryByAria() {
    const [
        queryByAria, getAllByAria, getByAria, findAllByAria, findByAria,
    ] = buildQueries(
        queryAllByAria,
        (c, name, value) => `Found multiple elements with aria-${name}=${value}`,
        (c, name, value) => `Unable to find an element with aria-${name}=${value}`,
    );

    return {
        queryAllByAria,
        queryByAria,
        getAllByAria,
        getByAria,
        findAllByAria,
        findByAria,
    };
}

const buildQueryByRoleAndTextApi = buildQueryByRoleAndText();
const buildQueryByAriaAPi = buildQueryByAria();

const allCustomQueries = {
    ...buildQueryByRoleAndTextApi,
    ...buildQueryByAriaAPi,
};

export default allCustomQueries;
