## UUI E2E and screenshot testing
We use the Playwright framework for E2E and screenshot testing.
All e2e tests infrastructure and tests definition is placed under `uui-e2e-tests` folder.

### Screenshots
UUI screenshot testing is based on 'Preview' pages that contain components in various variations of props.
These 'Preview' pages are used by Playwright to take screenshots.

Usually, if you edit or add a prop for a component, you need to include/update this prop in the screenshot tests.


#### Create/edit preview
Preview pages are based on Property Explorer and configured in explorerConfig files (`app/src/docs/explorerConfigs`).
The example of configuration 'Size Variants' and 'Color Variants' preview for Tag component:
```
  preview: (docPreview: DocPreviewBuilder<loveship.TagProps | uui.TagProps | promo.TagProps | electric.TagProps>) => {
        const TEST_DATA = {
            icon: 'action-account-fill.svg',
        };
        docPreview.add({
            id: TTagPreview['Size Variants'],
            matrix: {
                caption: { values: ['Test'] },
                size: { examples: '*' },
                count: { values: [undefined, '+99'] },
                icon: { examples: [TEST_DATA.icon, undefined] },
                iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                isDropdown: { examples: '*' },
                onClear: { examples: ['callback', undefined] },
            },
            cellSize: '210-60',
        });
        docPreview.add({
            id: TTagPreview['Color Variants'],
            matrix: {
                caption: { values: ['Test'] },
                icon: { examples: [TEST_DATA.icon] },
                count: { values: ['+99'] },
                isDropdown: { values: [true] },
                color: { examples: '*' },
                fill: { examples: '*' },
                isDisabled: { examples: '*' },
            },
            cellSize: '140-60',
        });
    },
```

For each preview, we define a matrix of props used to render the component in all possible variations from that matrix.
Usually, we split size (layout) and color (appearance) props into separate previews to limit the number of variations per screenshot.

After adding the preview, you can open it in the PE tab using the dropdown near the 'Fullscreen' button. The opened page will be used to take a screenshot.

#### Define tests with preview
Screenshot tests are defined with a builder in the `uui-e2e-tests/tests/previewTests/preview.e2e.ts` file.
Here we define an array of previews that will be used to make screenshots.
Example of definition Tag tests:
```
    .add(tag, [
        {
            previewId: [TTagPreview['Color Variants']],
            skins: SKINS.promo_loveship_electric,
            slow: true,
        },
        {
            previewId: [TTagPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TLinkButtonPreview['Color Variants']],
            previewTag: 'PseudoStateHover',
            skins: SKINS.promo_loveship_electric,
            forcePseudoState: [{ state: 'hover', selector: '.uui-tag' }],
        },
    ])
```

This configuration defines 3 screenshot tests: 'Color variants' in Promo/Loveship/Electric skins; 'Size variants' without skins; and 'Color variants' with hover effects (also in 3 skins).


### E2E tests
E2E tests are used to validate complex component behavior (not just visuals) that is hard or impossible to test via unit tests.

These tests are located in the `uui-e2e-tests/tests/Integration` folder.
These tests don't have a lot of automatization. You should define test environment via `setupDocExampleTest` helper, where need to define which page url should be used for this test and testing helpers object.
Then just write tests logic using playwright framework.




