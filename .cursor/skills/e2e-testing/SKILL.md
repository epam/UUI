---
name: uui-e2e-testing
description: Helps create and maintain E2E and screenshot tests for UUI components using Playwright. Use when adding E2E tests, creating screenshot tests, updating preview configurations, or working with Property Explorer previews for testing.
---

# UUI E2E Testing

UUI uses Playwright for E2E and screenshot testing. All test infrastructure is in `uui-e2e-tests/` folder. These tests are part of PR quality gate.

**Prerequisites:** The UUI docs server must be running before E2E tests. Start with `yarn start` or `yarn build-server && yarn start-server`. Tests default to `http://localhost:9009`. For setup details (Docker, browsers, env vars), see [uui-e2e-tests/readme.md](../../uui-e2e-tests/readme.md).

## Screenshot Testing

Screenshot tests use Preview pages from Property Explorer. When editing/adding component props, update screenshot tests accordingly.

### Create/Edit Preview

1. Go to `app/src/docs/explorerConfigs` and find/add config file for your component
2. Add preview configuration using `preview` function:

```typescript
preview: (docPreview: DocPreviewBuilder<ComponentProps>) => {
    const TEST_DATA = { icon: 'action-account-fill.svg' };
    
    // Object form
    docPreview.add({
        id: TComponentPreview['Size Variants'],
        matrix: {
            size: { examples: '*' },
            caption: { values: ['Test'] },
        },
        cellSize: '210-60',
    });
    
    // 3-argument shorthand form
    docPreview.add(TComponentPreview['Color Variants'], {
        color: { examples: '*' },
        fill: { examples: '*' },
    }, '140-60');
}
```

**Skin-specific overrides** with `docPreview.update()`:

```typescript
preview: (docPreview: DocPreviewBuilder<ComponentProps>) => {
    docPreview.add({ id: TComponentPreview['Size Variants'], matrix: { /* ... */ } });

    // Override matrix for specific skins
    docPreview.update(TComponentPreview['Size Variants'], {
        [TSkin.Loveship]: { fill: { values: ['solid'] } },
    });
}
```

**Guidelines:**
- Split size (layout) and color (appearance) props into separate previews
- Use `examples: '*'` to test all enum values
- Use `values: [...]` for specific test values
- Use `condition` for conditional props

### Define Screenshot Tests

Add test configuration in `uui-e2e-tests/tests/previewTests/preview.e2e.ts`:

```typescript
// Array form — multiple test configs per component
.add(componentName, [
    {
        previewId: [TComponentPreview['Color Variants']],
        skins: SKINS.promo_loveship_electric,
        slow: true, // Optional: for complex renders
    },
    {
        previewId: [TComponentPreview['Size Variants']],
    },
    {
        onlyChromium: true, // Optional: browser-specific
        previewId: [TComponentPreview['Color Variants']],
        previewTag: 'PseudoStateHover',
        skins: SKINS.promo_loveship_electric,
        forcePseudoState: [{ state: 'hover', selector: '.uui-component' }],
    },
])

// Single-object shorthand — simple components
.add(alert, { previewId: values(TAlertPreview) })
.add(tooltip, { previewId: values(TTooltipPreview), skins: SKINS.promo_loveship })
```

**Additional options:**
- `clickElement: () => 'input'` — click an element before screenshot (e.g. for DatePicker open state)

## E2E Tests

E2E tests validate complex component behavior that's hard to test via unit tests.

**Location:** `uui-e2e-tests/tests/Integration/`

**Setup:** Use `setupDocExampleTest` with `testUrl`, `PageObjectConstructor`, and Playwright fixtures (`pageWrapper`, `testInfo`). Page objects live in `uui-e2e-tests/framework/pageObjects/`.

**Example:**
```typescript
import { test } from '../../../framework/fixtures';
import { DropdownObject } from '../../../framework/pageObjects/dropdownObject';
import { setupDocExampleTest } from '../testUtils';

test('Dropdown / Boundary mode', async ({ pageWrapper }, testInfo) => {
    const { pageObject } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: DropdownObject,
        testUrl: '/preview?theme=loveship&isSkin=true&componentId=dropdown&previewId=...',
    });
    await pageObject.waitForContentLoad();
    await pageObject.hoverTarget();
    await pageObject.waitDropdownBodyVisible();
    // ... assertions
});
```

**testUrl** can target doc examples (`/docExample?examplePath=...`) or preview pages (`/preview?componentId=...&previewId=...`).

## Commands

- `yarn test-e2e` — Run all E2E tests
- `yarn test-e2e-chromium` — Run in Chromium only
- `yarn test-e2e-update` — Update screenshot baselines
- `yarn test-e2e-open-report` — Open test report

## Workflow

When adding/editing component props:
1. Update preview configuration in `app/src/docs/explorerConfigs`
2. Add screenshot test entries in `preview.e2e.ts`
3. Run `yarn test-e2e` to verify
4. Update screenshots if needed: `yarn test-e2e-update`

## References

- Setup and troubleshooting: [uui-e2e-tests/readme.md](../../uui-e2e-tests/readme.md)
- Integration test examples: `uui-e2e-tests/tests/Integration/`
