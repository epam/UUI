# Scrollbar Testing Utilities

This module contains utilities for stable testing of components using OverlayScrollbars, especially for snapshot tests.

## Problem

When testing components with ScrollBars, snapshots occasionally fail due to scrollbar transition states (class `os-scrollbar-transitionless`). This happens because OverlayScrollbars uses CSS transitions for smooth scrollbar appearance/disappearance.

## Solution

The `renderSnapshotWithContextAsync` function automatically waits for all scrollbar transitions to complete:

```typescript
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

const tree = await renderSnapshotWithContextAsync(
    <ScrollBars>
        <Button />
    </ScrollBars>
);
```

## Available Utilities

### `waitForScrollbarTransitionsToComplete()`
Waits for all CSS transitions related to scrollbars to complete (250ms).

## Recommendations

1. **Use `renderSnapshotWithContextAsync`** - it automatically handles all transitions
2. **For manual testing** add `await waitForScrollbarTransitionsToComplete()` before snapshots

## Usage Examples

### Basic Test
```typescript
it('should render ScrollBars correctly', async () => {
    const tree = await renderSnapshotWithContextAsync(
        <ScrollBars>
            <Button />
        </ScrollBars>
    );
    expect(tree).toMatchSnapshot();
});
```

### Test with Additional Waiting
```typescript
import { waitForScrollbarTransitionsToComplete } from '@epam/uui-test-utils';

it('should handle scrollbar transitions properly', async () => {
    const tree = await renderSnapshotWithContextAsync(
        <ScrollBars autoHide>
            <div style={{ height: '200px' }}>
                <Button />
            </div>
        </ScrollBars>
    );

    // Additional waiting for complex cases
    await waitForScrollbarTransitionsToComplete();

    expect(tree).toMatchSnapshot();
});
```
