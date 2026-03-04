---
name: uui-themes
description: Helps work with UUI themes including generating theme tokens from Figma, working with skin packages, and connecting external themes. Use when generating theme tokens, working with loveship/electric/promo themes, or connecting external themes.
---

# UUI Themes

UUI supports multiple themes (skins) and allows connecting external themes. Built-in themes include Loveship, Electric, and Promo.

## Built-in Theme Packages

UUI includes three styled theme packages:

- **`@epam/loveship`** — Loveship theme (light and dark modes)
- **`@epam/electric`** — Electric theme (light and dark modes)
- **`@epam/promo`** — Promo theme

These are located in:
- `loveship/` — Loveship theme package
- `epam-electric/` — Electric theme package
- `epam-promo/` — Promo theme package

## Generating Theme Tokens from Figma

Theme tokens are generated from Figma JSON exports.

### Process

1. **Obtain Theme.json from UX design team**
   - Request the most recent `Theme.json` file exported from Figma

2. **Replace existing file**
   - Place new `Theme.json` in `public/docs/figmaTokensGen/Theme.json`
   - Replace the existing file

3. **Generate tokens**
   ```bash
   yarn generate-theme-tokens
   ```

   **Important:** Run from UUI monorepo root!

### Generated Files

The command generates:

- **`public/docs/figmaTokensGen/ThemeOutput.json`** — Original file with added CSS variable info:
  ```json
  {
    "codeSyntax": {
      "WEB": "var(--uui-control-border-focus)"
    }
  }
  ```
  This file should be sent back to UX designers to import into Figma.

- **`public/docs/figmaTokensGen/ThemeTokens.json`** — Normalized tokens with inheritance hierarchy in minimalistic format. Used for:
  - Color palette documentation
  - Token tables in sandbox

- **`epam-assets/theme/variables/tokens/*.scss`** — Theme-specific SCSS mixins with token variables

### Token Structure

Tokens include:
- **Modes** — Theme variants (e.g., Loveship-Light, Loveship-Dark, Promo, Electric-Light, Electric-Dark)
- **Exposed tokens** — CSS variables with values per theme
- **Value chains** — Token aliases and inheritance

Example token:
```json
{
  "id": "core/controls/control-bg",
  "type": "COLOR",
  "cssVar": "--uui-control-bg",
  "valueByTheme": {
    "Loveship-Light": {
      "value": "#FFFFFF",
      "valueChain": {
        "alias": [
          { "id": "core/surfaces/surface-main", "cssVar": "--uui-surface-main" }
        ]
      }
    }
  }
}
```

## External Themes

Connect themes hosted outside the UUI repository.

### Setup

1. **Add theme URLs to localStorage:**
   ```javascript
   localStorage.setItem('uui-custom-themes', JSON.stringify({
       customThemes: [
           "https://cdn.example.com/theme-1",
           "https://cdn.example.com/theme-2"
       ]
   }))
   ```

2. **Theme URL must serve `/theme-manifest.json`**

### Theme Manifest Structure

The theme URL must serve a `/theme-manifest.json` endpoint with this structure:

```typescript
interface IThemeManifest {
    id: string;                    // Unique theme identifier
    name: string;                  // Display name
    css: string[];                 // Array of CSS file URLs
    settings?: string | null;      // Optional settings URL
    propsOverride?: {              // Optional component prop overrides
        [typeRef: string]: {
            [propName: string]: IThemeManifestPropOverride
        }
    };
}
```

**Example manifest:**
```json
{
  "id": "custom-theme",
  "name": "Custom Theme",
  "css": [
    "https://cdn.example.com/theme-1/styles.css"
  ],
  "settings": "https://cdn.example.com/theme-1/settings.json"
}
```

### CSS Variables and uui-* Classes

**CSS variables** use `--uui-*` prefix:
- `--uui-control-bg`, `--uui-control-border`, `--uui-text-primary`, etc.
- Defined in theme token SCSS files. Follow existing token structure for consistency.

**Global utility classes** use `uui-*` prefix for themeable props. These are applied by components via `applyMods`:

| Pattern | Purpose | Examples |
|---------|---------|----------|
| `uui-color-{value}` | Text/icon color | `uui-color-primary`, `uui-color-neutral`, `uui-color-error` |
| `uui-size-{value}` | Component size | `uui-size-24`, `uui-size-36`, `uui-size-48` |
| `uui-fill-{value}` | Button fill style | `uui-fill-solid`, `uui-fill-outline`, `uui-fill-ghost` |
| `uui-{component}` | Component root | `uui-button`, `uui-tab-button`, `uui-input-box` |
| `uui-{component}_{part}` | Component part | `uui-icon_button`, `uui-link_button` |

Skin packages (loveship, epam-electric, epam-promo) define styles for these classes. When adding new component mods, follow the same pattern so themes can style them.

## Working with Theme Tokens in Components

Components access theme tokens via CSS variables:

```scss
// Component.module.scss
.root {
    background-color: var(--uui-control-bg);
    border-color: var(--uui-control-border);
    color: var(--uui-text-primary);
}
```

## Theme Settings

Components can access theme settings via the `settings` object:

```typescript
import { settings } from '../../settings';

// Access theme-specific icons, sizes, etc.
const icon = settings.button.icons.dropdownIcon;
const defaultSize = settings.button.sizes.default;
```

## Commands

**Generate theme tokens:**
```bash
yarn generate-theme-tokens
```

**Process icons** (if updating theme icons):
```bash
yarn process-icons
```
Place icons in `icons-source` folder first.

## References

- Theme tokens generation: `uui-build/ts/themeTokens.md`
- External themes: [.cursor/skills/documentation/SKILL.md](../documentation/SKILL.md) (External Themes section)
- Theme tokens output: `public/docs/figmaTokensGen/ThemeTokens.json`
- SCSS mixins: `epam-assets/theme/variables/tokens/`
