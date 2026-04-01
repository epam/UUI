---
name: uui-components
description: Helps create and modify UUI (EPAM Unified UI) components following established patterns. Use when creating new components, modifying existing components, working with withMods, component props, styling, or component architecture in the UUI library.
---

# UUI Components Skill

## Package Structure

- **`@epam/uui-components`** — Legacy package with logic-only components (no visual styles). Contains older components.
- **`@epam/uui`** — Package for ready-to-use, themeable components. **All new components must be created here** in the `uui/` folder.

When creating new components, add them to `uui/components/`, not to `uui-components/`.

## File Path Conventions

Components are organized by category in `uui/components/`:

| Category | Path | Examples |
|----------|------|----------|
| buttons | `uui/components/buttons/` | Button, IconButton, LinkButton |
| inputs | `uui/components/inputs/` | Checkbox, TextInput, NumericInput, Switch |
| typography | `uui/components/typography/` | Text, TextPlaceholder, RichTextView |
| overlays | `uui/components/overlays/` | Modal, Tooltip, DropdownMenu |
| layout | `uui/components/layout/` | FlexRow, FlexCell, Blocker |
| pickers | `uui/components/pickers/` | PickerInput, PickerModal |
| datePickers | `uui/components/datePickers/` | DatePicker, RangeDatePicker |
| dnd | `uui/components/dnd/` | Drag and drop |
| widgets | `uui/components/widgets/` | Tag, Badge, Spinner |
| tables | `uui/components/tables/` | DataTable |
| filters | `uui/components/filters/` | FiltersPanel |
| navigation | `uui/components/navigation/` | MainMenu, TabButton |
| forms | `uui/components/forms/` | Form components |
| fileUpload | `uui/components/fileUpload/` | File upload |
| errors | `uui/components/errors/` | Error handling |

Each component typically has:
- `ComponentName.tsx` — Component implementation
- `ComponentName.module.scss` — Styles (SCSS modules)
- `__tests__/ComponentName.test.tsx` — Unit tests

## Component Creation Workflows

### Workflow 1: Wrapping Existing `uui-components` Component

When wrapping a logic-only component from `@epam/uui-components`:

**Example: IconButton**

```typescript
import * as uuiComponents from '@epam/uui-components';
import { withMods, Overwrite } from '@epam/uui-core';
import { settings } from '../../settings';
import css from './IconButton.module.scss';

// 1. Define mods type for themeable properties
interface IconButtonMods {
    color?: 'info' | 'success' | 'error' | 'primary' | 'accent' | 'critical' | 'warning' | 'secondary' | 'neutral' | 'white';
    size?: '18' | '24' | '30' | '36';
}

export interface IconButtonModsOverride {}

// 2. Create props interface extending core props
export type IconButtonCoreProps = Omit<uuiComponents.IconButtonProps, 'size'>;
export interface IconButtonProps extends IconButtonCoreProps, Overwrite<IconButtonMods, IconButtonModsOverride> {}

// 3. Create applyMods function that returns CSS classes
function applyIconButtonMods(props: IconButtonProps) {
    return [
        'uui-icon_button',
        `uui-color-${props.color || 'neutral'}`,
        css.root, // SCSS module class
    ];
}

// 4. Wrap with withMods HOC
export const IconButton = withMods<uuiComponents.IconButtonProps, IconButtonProps>(
    uuiComponents.IconButton, // Core component
    applyIconButtonMods, // Mods function
    (props) => {
        // Optional: transform props or add defaults
        return {
            dropdownIcon: props.dropdownIcon || settings.iconButton.icons.dropdownIcon,
        };
    },
);
```

**Key points:**
- `withMods<CoreProps, Props>(coreComponent, applyMods, propsTransformer?)`
- `applyMods` returns array of CSS class strings
- Third parameter is optional function to transform/inject props
- Use `Overwrite<Mods, ModsOverride>` pattern for extensibility

### Workflow 2: Brand-New Component (No `uui-components` Counterpart)

When creating a component from scratch:

**Example: TextPlaceholder**

```typescript
import * as React from 'react';
import cx from 'classnames';
import { IHasCX, IHasRawProps } from '@epam/uui-core';
import css from './TextPlaceholder.module.scss';
import { PropsWithChildren } from 'react';

// 1. Define props interface
export interface ITextPlaceholderProps extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasCX {
    wordsCount?: number;
    isNotAnimated?: boolean;
}

export type TextPlaceholderProps = PropsWithChildren<ITextPlaceholderProps>;

// 2. Implement component directly
export const TextPlaceholder: React.FunctionComponent<TextPlaceholderProps> = (props) => {
    // Component logic here
    return (
        <div className={cx(css.root, 'uui-text-placeholder')} {...props.rawProps}>
            {/* Component JSX */}
        </div>
    );
};
```

**Key points:**
- Implement directly without `withMods` if not themeable
- Use `IHasCX` and `IHasRawProps` from `@epam/uui-core` for standard props
- Use `cx` (classnames) for conditional classes
- Use SCSS modules for styling

## Styling Patterns

### SCSS Modules

Components use SCSS modules (`.module.scss`):

```scss
// IconButton.module.scss
.root {
    display: inline-flex;
    align-items: center;
    // Styles here
}
```

Import in component:
```typescript
import css from './IconButton.module.scss';
```

### Mods to CSS Classes

The `applyMods` function maps props to CSS classes:

```typescript
function applyButtonMods(mods: ButtonProps) {
    return [
        css.root, // SCSS module class
        'uui-button', // Global UUI class
        `uui-fill-${mods.fill || 'solid'}`, // Dynamic class from prop
        `uui-color-${mods.color || 'primary'}`,
        `uui-size-${mods.size || settings.button.sizes.default}`,
    ];
}
```

**Patterns:**
- Use `css.root` for component-specific styles
- Use `uui-*` prefixed classes for themeable utilities
- Use `settings.componentName.*` for default values
- Return array of class strings (will be joined by `withMods`)

## Export Pattern

### Component-Level Index

Each category folder has an `index.ts` that re-exports components:

```typescript
// uui/components/buttons/index.ts
export * from './Button';
export * from './IconButton';
export * from './LinkButton';
```

### Root Index

Main `uui/components/index.ts` re-exports all categories:

```typescript
// uui/components/index.ts
export * from './buttons';
export * from './inputs';
export * from './typography';
// ... etc
```

**When adding a new component:**
1. Export from component file: `export const MyComponent = ...`
2. Add to category `index.ts`: `export * from './MyComponent';`
3. If new category, add to root `index.ts`: `export * from './newCategory';`

## Common Patterns

### cx Prop (IHasCX)

Most components extend `IHasCX`, which adds a `cx` prop for consumer styling. Always merge `props.cx` into the root element's classNames so consumers can pass custom classes:

```typescript
import cx from 'classnames';

// With withMods — withMods merges cx automatically
// Manual mods:
<div className={cx(applyTagMods(props), props.cx)}>
<Clickable cx={cx(applyTagMods(props), props.cx)} {...props} />
```

### Using Settings

The `settings` object (`uui/settings.tsx`) provides theme-specific defaults: icons, sizes, placeholders. Structure: `settings.<component>.<category>.<key>`.

**Access:**
```typescript
import { settings } from '../../settings';

// Icons
dropdownIcon: props.dropdownIcon || settings.iconButton.icons.dropdownIcon,
// Sizes
size: props.size || settings.button.sizes.default,
```

**Structure:** Each component has nested objects (e.g. `icons`, `sizes`). Themes override via `PartialSettings` — see skin packages (loveship, epam-electric, epam-promo) for how settings are merged. To add new component settings, add a section in `uui/settings.tsx` following existing patterns (e.g. `accordionSettings`, `buttonSettings`).

### Props Transformation

The third parameter of `withMods` can transform props:

```typescript
export const TextInput = withMods<CoreTextInputProps, TextInputProps>(
    uuiTextInput,
    applyTextInputMods,
    () => ({
        acceptIcon: settings.textInput.icons.acceptIcon,
        cancelIcon: settings.textInput.icons.clearIcon,
        dropdownIcon: settings.textInput.icons.dropdownIcon,
    }),
);
```

### Conditional Mods

Apply mods conditionally in `applyMods`:

```typescript
function applyCheckboxMods(mods: CheckboxMods) {
    return [
        css.root,
        `uui-size-${mods.size || settings.checkbox.sizes.default}`,
        'uui-control-mode-' + (mods.mode || 'form'),
        'uui-color-primary',
    ];
}
```

## Additional Patterns

### Using `forwardRef`

Many components expose refs via `React.forwardRef`. Use when consumers need direct DOM access (e.g. focus management, measurements):

```typescript
import React from 'react';
import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';

// withMods works with forwardRef components automatically.
// If the core component uses forwardRef, the wrapped component inherits it.
export const Switch = withMods<uuiComponents.SwitchProps, SwitchProps>(uuiComponents.Switch, applySwitchMods);
```

For brand-new components without `withMods`:

```typescript
export const Tag = React.forwardRef<HTMLElement, TagProps>((props, ref) => {
    return (
        <div ref={ ref } className={ cx(applyTagMods(props), props.cx) }>
            {/* ... */}
        </div>
    );
});
```

### Manual Mods (without `withMods`)

Some components apply mods manually instead of using `withMods`. This is common when wrapping primitives like `Clickable` with `forwardRef`:

```typescript
export const Tag = React.forwardRef<HTMLElement, TagProps>((props, ref) => {
    return (
        <Clickable
            cx={ cx(applyTagMods(props), props.cx) }
            ref={ ref }
            { ...props }
        />
    );
});

function applyTagMods(props: TagProps) {
    return [
        css.root,
        `uui-size-${props.size || '36'}`,
        `uui-color-${props.color || 'neutral'}`,
    ];
}
```

See `uui/components/widgets/Tag.tsx`, `uui/components/layout/FlexRow.tsx` for examples.

### Data-Driven Components (DataTable, PickerInput)

Components like DataTable, PickerInput, PickerModal, and FiltersPanel use DataSource from `@epam/uui-core`. See [.cursor/skills/data-sources/SKILL.md](../data-sources/SKILL.md) for DataSource usage.

### Deprecation Warnings

Use `devLogger` to warn about deprecated prop values:

```typescript
import { devLogger } from '@epam/uui-core';

devLogger.warnAboutDeprecatedPropValue<IconButtonProps, 'color'>({
    component: 'IconButton',
    propName: 'color',
    propValue: props.color,
    condition: () => ['info', 'success'].includes(props.color),
    message: "'info' and 'success' colors are deprecated. Use 'primary' instead.",
});
```

## References

- Example wrapping component: `uui/components/buttons/IconButton.tsx`
- Example brand-new component: `uui/components/typography/TextPlaceholder.tsx`
- Example with complex mods: `uui/components/inputs/TextInput.tsx`
- Example with props transformation: `uui/components/buttons/Button.tsx`
- Example with forwardRef + manual mods: `uui/components/widgets/Tag.tsx`
