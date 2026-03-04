---
name: uui-unit-testing
description: Helps write unit tests for UUI components using Jest, jsdom, and @epam/uui-test-utils. Use when writing unit tests for UUI components, updating snapshots, running Jest tests, or working with test utilities.
---

# UUI Unit Testing

UUI uses Jest with jsdom for unit testing React components. Tests are located in `__tests__` folders within each package.

## Test File Location

Test files follow the pattern: `**/__tests__/**/*.test.{js,ts,tsx}`

**Examples:**
- `uui/components/buttons/__tests__/Button.test.tsx`
- `uui/components/inputs/__tests__/NumericInput.test.tsx`
- `uui-core/src/hooks/__tests__/useVirtualList.test.tsx`

## Test Commands

**Run all tests:**
```bash
yarn test
```

**Run tests in watch mode:**
```bash
yarn test-watch
```

**Run a single test file:**
```bash
yarn test -- --testPathPattern="Button"
```
Use `--testPathPattern` to match file path, or `--testNamePattern="should render"` to match test names.

**Update snapshots:**
```bash
yarn test-update
```

**Generate test coverage report:**
```bash
yarn test-report
```
Coverage report saves to `.reports/unit-tests` folder.

**TypeScript type checking:**
```bash
yarn test-typecheck
```

**Windows workaround:** If encountering test errors on Windows, use reduced worker count:
```bash
yarn test --maxWorkers=2 --testTimeout=10000
```
You can increase `maxWorkers` up to 4 if needed.

## Using @epam/uui-test-utils

The `@epam/uui-test-utils` package provides helpers for testing UUI components with proper context.

### Key Exports

| Export | Purpose |
|--------|---------|
| `renderSnapshotWithContextAsync` | Render with UUI context, returns `DocumentFragment` for snapshots |
| `renderWithContextAsync` | Render with UUI context for interaction testing |
| `renderHookWithContextAsync` | Test custom hooks with UUI context |
| `setupComponentForTest` | Setup component with mocks and `setProps` helper |
| `screen` | Re-exported from `@testing-library/react` |
| `userEvent` | Re-exported from `@testing-library/user-event` |
| `fireEvent` | Re-exported from `@testing-library/react` |
| `SvgMock` | Mock for SVG icon imports in snapshots |
| `mockReactPortalsForSnapshots` | Mock portals for snapshot tests |
| `delay`, `delayAct` | Async timing utilities for tests |

### renderSnapshotWithContextAsync

Renders component with UUI context and returns a `DocumentFragment` (via `asFragment()`) for snapshot matching:

```typescript
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { NumericInput } from '../NumericInput';

it('should be rendered with minimum props', async () => {
    const tree = await renderSnapshotWithContextAsync(
        <NumericInput value={null} onValueChange={jest.fn} min={0} max={50} />
    );
    expect(tree).toMatchSnapshot();
});
```

### setupComponentForTest

Use for testing **controlled components** (e.g. `value` + `onValueChange`). Provides `setProps` to update props without unmounting, and `mocks` for callback assertions. Call `context.current.setProperty(name, value)` in callback mocks to simulate controlled updates:

```typescript
import { setupComponentForTest, screen, fireEvent } from '@epam/uui-test-utils';
import { TextInput } from '@epam/uui';

interface TestComponentProps {
    value?: string;
    onValueChange?: (value: string) => void;
}

const { mocks, setProps } = await setupComponentForTest<TestComponentProps>(
    (context) => ({
        value: 'initial',
        onValueChange: jest.fn().mockImplementation((newValue) => {
            context.current.setProperty('value', newValue);
        }),
    }),
    (props) => <TextInput value={props.value} onValueChange={props.onValueChange} />,
);

const input = screen.queryByRole('textbox');
fireEvent.change(input, { target: { value: 'updated' } });
expect(mocks.onValueChange).toHaveBeenLastCalledWith('updated');

setProps({ value: 'external' }); // Update props without unmounting
```

### renderHookWithContextAsync

Renders a hook with UUI context. Returns `{ result, rerender, unmount, svc }`:
- **result** — current hook return value (use `result.current`)
- **svc** — UUI services (api, modals, router, etc.) for mocking or assertions
- **rerender**, **unmount** — same as `renderHook` from Testing Library

```typescript
import { renderHookWithContextAsync, act } from '@epam/uui-test-utils';

it('should use DataSource view', async () => {
    const dataSource = useArrayDataSource({ items: [...], getId: (i) => i.id }, []);
    const { result, svc } = await renderHookWithContextAsync(() =>
        dataSource.useView({}, () => {}, {})
    );
    const rows = result.current.getVisibleRows();
    expect(rows).toHaveLength(5);
    // svc.api, svc.uuiModals, etc. available for mocks
});

it('should test custom hook with services', async () => {
    const { result, svc } = await renderHookWithContextAsync(useMyHook);
    act(() => result.current.doSomething());
    expect(svc.uuiAnalytics.sendEvent).toHaveBeenCalled();
});
```

### renderWithContextAsync

Renders component with UUI context for interaction testing:

```typescript
import { renderWithContextAsync, screen, userEvent } from '@epam/uui-test-utils';
import { Tag } from '../Tag';

it('should call onClear callback', async () => {
    const onClearMock = jest.fn();
    
    await renderWithContextAsync(
        <Tag caption="Test badge" onClear={onClearMock} />
    );
    
    const clearButton = await screen.findByRole('button', { name: /remove tag/i });
    await userEvent.click(clearButton);
    
    expect(onClearMock).toHaveBeenCalled();
});
```

## Test Structure

### Basic Snapshot Test

```typescript
import React from 'react';
import { ComponentName } from '../ComponentName';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('ComponentName', () => {
    describe('snapshots', () => {
        it('should be rendered with minimum props', async () => {
            const tree = await renderSnapshotWithContextAsync(<ComponentName />);
            expect(tree).toMatchSnapshot();
        });

        it('should be rendered with maximum props', async () => {
            const tree = await renderSnapshotWithContextAsync(
                <ComponentName prop1="value1" prop2="value2" />
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
```

### Interaction Test

```typescript
import { renderWithContextAsync, screen, userEvent } from '@epam/uui-test-utils';

it('should handle user interaction', async () => {
    const onActionMock = jest.fn();
    
    await renderWithContextAsync(
        <ComponentName onAction={onActionMock} />
    );
    
    const button = await screen.findByRole('button');
    await userEvent.click(button);
    
    expect(onActionMock).toHaveBeenCalled();
});
```

## Snapshot Update Workflow

When UI changes require snapshot updates:

1. **Run tests** to see which snapshots fail:
   ```bash
   yarn test
   ```

2. **Review changes** - verify the visual changes are intentional

3. **Update snapshots**:
   ```bash
   yarn test-update
   ```

4. **Commit updated snapshots** along with component changes

**Important:** Always review snapshot diffs before updating. Snapshots should reflect intentional UI changes, not accidental regressions.

## Test Environment

- **Test framework:** Jest
- **Test environment:** jsdom (for React components), node (for build scripts)
- **Test utilities:** `@epam/uui-test-utils` for component testing helpers

## Test Coverage

Test coverage is collected from:
- `uui-core`
- `uui-components`
- `uui`
- `epam-promo`
- `epam-electric`
- `loveship`

Run `yarn test-report` to generate coverage reports.

## Common Patterns

### Mocking Portals for Snapshots

Use the built-in helper instead of manual mocking:

```typescript
import { mockReactPortalsForSnapshots, renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('ComponentWithPortal', () => {
    mockReactPortalsForSnapshots();

    it('should render correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<MyModal />);
        expect(tree).toMatchSnapshot();
    });
});
```

### Testing with Icons

Use `SvgMock` from test utils for icon props in snapshots:

```typescript
import { SvgMock, renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

it('should render with icon', async () => {
    const tree = await renderSnapshotWithContextAsync(
        <Component icon={ SvgMock } />
    );
    expect(tree).toMatchSnapshot();
});
```

For specific icon imports (when behavior depends on the icon):

```typescript
// @ts-expect-error
import { ReactComponent as CalendarIcon } from '@epam-assets/icons/action-calendar-fill.svg';
```

## Best Practices

1. **Add tests for bug fixes** - Prevent regressions
2. **Add tests for new functionality** - Ensure components work as expected
3. **Update snapshots when UI changes** - Keep snapshots current
4. **Run full test suite before committing** - `yarn test`
5. **Use descriptive test names** - Make failures easy to understand
6. **Test user interactions** - Not just rendering, but behavior

## References

- Test utilities: `@epam/uui-test-utils` package
- Example snapshot test: `uui/components/inputs/__tests__/NumericInput.test.tsx`
- Example interaction test: `uui/components/widgets/__tests__/Tag.test.tsx`
- Example setupComponentForTest: `app/src/docs/_examples/testing/__tests__/testComponent.test.tsx`
- Example renderHookWithContextAsync: `uui-core/src/data/forms/__tests__/useForm.test.tsx`
- Testing documentation: https://uui.epam.com/documents?id=testing-getting-started&mode=doc&isSkin=null&category=testing
