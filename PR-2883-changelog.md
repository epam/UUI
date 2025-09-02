# VerticalTabButton rework, Tree component for @epam/uui package

**What's New**
* [Tree]: new hierarchical data display component for @epam/uui package
* [useIsActive]: extracted hook for managing active state logic
  * Added proper priority order: manual `isActive` > deprecated `isLinkActive` > router-based active state
  * Added deprecation warning for `isLinkActive` prop
  * Improved type safety with dedicated interfaces
* [VerticalTabButton][Breaking Change]: complete rework with improved functionality and styling
  * Added `renderAddons` prop for custom addons rendering
  * Removed deprecated `count` prop, use `renderAddons` instead
  * Removed deprecated `isDropdown` prop
  * Added `indent` and `isFoldable` props support
  * Updated size variants according to design system: `'36' | '48' | '60'` (was `'30' | '36' | '48'`)
  * Changed default size from `'48'` to `'36'` to match design requirements
  * Extracted `isActive` interface for better type safety and reusability
  * Removed non-functional props that were not working properly
* [Sidebar]: refactored to use new Tree component
  * Replaced custom Tree implementation with @epam/uui Tree
  * Improved data source integration using `useArrayDataSource`


**What's Fixed**
* [DocsBlock]: fixed context validation logic
* [SandboxPage]: updated to use DocItem type instead of TreeListItem
* Updated type exports, removed deprecated TreeListItem type from @epam/uui-components

**What's Removed**
* [SidebarButton]: removed in favor of Tree component integration
* [CustomHierarchicalList]: example replaced with new Tree examples
* [TreeListItem]: type removed from @epam/uui-components exports

## Migration Guide

### VerticalTabButton
```tsx
// Before
<VerticalTabButton
  caption="Tools"
  count={18}
  isDropdown={true}
  size="48" // old default
/>

// After
<VerticalTabButton
  caption="Tools"
  renderAddons={() => <CountIndicator caption="18" />}
  isFoldable={true}
  size="36" // new default, old sizes (30, 36, 48) changed to (36, 48, 60)
/>
```

**Breaking Changes:**
- Size variants changed from `'30' | '36' | '48'` to `'36' | '48' | '60'`
- Default size changed from `'48'` to `'36'`
- If you were using `size="30"`, you'll need to use `size="36"` instead
- If you were using `size="36"`, you'll need to use `size="48"` instead
- If you were using `size="48"`, you'll need to use `size="60"` instead

### Sidebar/Tree Usage
The Sidebar component now uses the new Tree component internally. If you were using custom Tree implementations, consider migrating to the new Tree component:

```tsx
// New Tree component usage
<Tree
  view={view}
  value={value}
  onValueChange={setValue}
  size="36"
/>
```