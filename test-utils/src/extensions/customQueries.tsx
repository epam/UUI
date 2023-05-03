import { buildQueries, within } from '@testing-library/react';

function queryAllByRoleAndText(container: HTMLElement, params: { role: string, text: string }) {
    return within(container).queryAllByRole(params.role).filter((e) => e.textContent === params.text);
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

const buildQueryByRoleAndTextApi = buildQueryByRoleAndText();

const allCustomQueries = {
    ...buildQueryByRoleAndTextApi,
};

export default allCustomQueries;
