import type { TDocsGenExportedType, TSharedPropEditorType } from '@epam/uui-docs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test, Page } from '@playwright/test';

export enum TTheme {
    electric = 'electric',
    loveship = 'loveship',
    loveship_dark = 'loveship_dark',
    promo = 'promo',
    vanilla_thunder = 'vanilla_thunder'
}

const componentPeURL = (params: { id: string; theme: TTheme; isSkin: boolean; }) => {
    const query: Record<string, any> = {
        category: 'components',
        id: params.id,
        mode: 'propsEditor',
        isSkin: params.isSkin,
        theme: params.theme,
    };
    const queryStr = Object.keys(query).map((name) => `${name}=${query[name]}`).join('&');
    return `/documents?${queryStr}`;
};

type TTestMatrix = {
    theme: TTheme[];
    isSkin: boolean[];
    props: TPropsMatrix;
};

type TTestComponentScreenshotParams = {
    /**
     * This "id" which corresponds to "id" URL param defined here: app/src/documents/structure.ts
     */
    id: string;
    /**
     * It will be used to validate prop names from the "propsMatrix" param.
     */
    typeRef?: TDocsGenExportedType;
    matrix: TTestMatrix;
};

type TPropsMatrix = Record<string, { editor?: TSharedPropEditorType, examples: string[] }>;
type TPropsMatrixArr = Record<string, { editor?: TSharedPropEditorType, example: string }>[];

function propsTestMatrixToArr(propsTestMatrix: TPropsMatrix) {
    const finalRes: TPropsMatrixArr = [];
    const allPropNames = Object.keys(propsTestMatrix);
    if (allPropNames.length) {
        const currentPropName = allPropNames[0];
        const { examples, editor } = propsTestMatrix[currentPropName];
        const remainingPropsMatrix = { ...propsTestMatrix };
        delete remainingPropsMatrix[currentPropName];

        examples.forEach((example) => {
            if (Object.keys(remainingPropsMatrix).length > 0) {
                const remainingPropsRes = propsTestMatrixToArr(remainingPropsMatrix);
                remainingPropsRes.forEach((re) => {
                    finalRes.push({
                        [currentPropName]: { editor, example },
                        ...re,
                    });
                });
            } else {
                finalRes.push({
                    [currentPropName]: { editor, example },
                });
            }
        });
    }

    return finalRes;
}

export function testComponentScreenshot(params: TTestComponentScreenshotParams) {
    const { id, matrix } = params;

    const pageMatrix: { theme: TTheme; isSkin: boolean; props: TPropsMatrixArr }[] = [];
    matrix.isSkin.forEach((isSkin) => {
        matrix.theme.forEach((theme) => {
            const props = propsTestMatrixToArr(matrix.props);
            pageMatrix.push({ isSkin, theme, props });
        });
    });

    for (let i = 0; i < pageMatrix.length; i++) {
        const { isSkin, theme, props } = pageMatrix[i];
        props.forEach((currentSetOfProps) => {
            const propsStr = Object.keys(currentSetOfProps).map((name) => {
                return `${name}=${currentSetOfProps[name].example}`;
            }).join(' ');
            const testName = `[${id}] Theme=${theme} Skin=${isSkin} Props=(${propsStr})`;
            test(testName, async ({ page }) => {
                const url = componentPeURL({ id, theme, isSkin });
                await page.goto(url);
                await setAllProps({ page, props: currentSetOfProps });
                const previewRegion = page.getByRole('region', { name: 'Component preview for context' });
                const clip = await previewRegion.boundingBox();
                await expect(page).toHaveScreenshot(`(${testName})${id}.png`, { clip });
            });
        });
    }
}

async function setAllProps(params: { page: Page; props: TPropsMatrixArr[number] }) {
    const { page, props } = params;
    const entries = [...Object.entries(props)];
    for (let i = 0; i < entries.length; i++) {
        const [name, { example }] = entries[i];
        await setProp({ page, name, example });
    }
}

async function setProp(params: { page: Page, name: string, example: string }) {
    const { page, name, example } = params;
    const propsRegion = page.getByRole('region', { name: 'Component properties' });
    const tableRow = propsRegion.locator(`[role="table"] [role="row"]:has([role="cell"]:first-child:has-text("${name}"))`);
    const buttonInThirdCell = tableRow.locator(`[role="cell"]:nth-child(3) button[role="tab"]:has-text("${example}")`);
    await buttonInThirdCell.click();
    const realBtn = await buttonInThirdCell.elementHandle();
    await page.waitForFunction((button) => button.getAttribute('aria-current') === 'true', realBtn);
}
