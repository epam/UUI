---
name: uui-documentation
description: Helps update UUI documentation, add doc examples, configure Property Explorer, and manage component API documentation. Use when adding documentation examples, updating Property Explorer configs, generating API references, working with UUI documentation site, or when adding/removing/modifying public props on component interfaces.
---

# UUI Documentation

UUI documentation is published on [uui.epam.com](https://uui.epam.com/). Sources are in `./app` folder.

**Dependency:** Property Explorer configs and doc examples use `@epam/uui-docs`, which provides `DocBuilder`, `TDocContext`, `TSkin`, `DocPreviewBuilder`, demo API, and PE editors. The package lives in `uui-docs/`.

## Add Doc Example

1. Go to `app/src/docs/_examples` and open/add folder for your component
2. Add example file: `example-name.example.tsx`
3. Add link in page config (`app/src/docs/pages/components/<component>.json`):
   ```json
   {
       "id": "alert",
       "name": "Alert",
       "parentId": "components",
       "examples": [
           { "descriptionPath": "alert-descriptions" },
           { "name": "Basic", "componentPath": "alert/Basic.example.tsx" }
       ]
   }
   ```
4. If adding new page, register it in `app/src/documents/structure/components.ts` for sidebar menu
5. Open local environment (http://localhost:9009/), navigate to page, add description via RTE field

## Property Explorer

Property Explorer lets users interactively test components in different prop variations. Most content is auto-generated from component prop types.

**Preview vs screenshot tests:** The `preview` function in explorerConfigs defines **Preview pages** for documentation — users can switch props and see changes. Screenshot tests (in [e2e-testing](../e2e-testing/SKILL.md)) use these same previews to capture baseline images. Create previews here for docs; add screenshot test entries in `preview.e2e.ts` to include them in E2E.

### Add/Update ExplorerConfig

1. Go to `app/src/docs/explorerConfigs` and find/add config file
2. Use same id as page config where PE should be connected
3. Add contexts:
   ```typescript
   contexts: [
       TDocContext.Default,
       TDocContext.Resizable,
       TDocContext.Form,
       TDocContext.Table
   ]
   ```
4. Define `bySkin` mapping:
   ```typescript
   bySkin: {
       [TSkin.UUI]: { type: '@epam/uui:TextInputProps', component: uui.TextInput },
       [TSkin.Loveship]: { type: '@epam/uui:TextInputProps', component: loveship.TextInput },
       [TSkin.Promo]: { type: '@epam/uui:TextInputProps', component: promo.TextInput },
       [TSkin.Electric]: { type: '@epam/uui:TextInputProps', component: electric.TextInput },
   }
   ```
5. (Optional) Override prop editor defaults:
   ```typescript
   doc: (doc: DocBuilder<uui.TextInputProps>) => {
       doc.merge('type', { defaultValue: 'text' });
       doc.merge('maxLength', { examples: [10, 20, 30] });
   }
   ```

## API Block

Component API section is auto-generated from prop interfaces.

**Generate locally:**
```bash
yarn generate-components-api
```

**Important:** You **must** run this command whenever public props are added, removed, or modified on any component interface (in `uui-core`, `uui-components`, or `uui`). Without this step, new or changed props will not appear in the Property Explorer or API docs.

## External Themes

To connect external themes (not in UUI repo):

1. Add to localStorage:
   ```javascript
   localStorage.setItem('uui-custom-themes', JSON.stringify({
       customThemes: [
           "https://cdn.example.com/theme-1",
           "https://cdn.example.com/theme-2"
       ]
   }))
   ```

2. Theme URL must serve `/theme-manifest.json` with structure:
   ```typescript
   interface IThemeManifest {
       id: string;
       name: string;
       css: string[];
       settings?: string | null;
       propsOverride?: { [typeRef: string]: { [propName: string]: IThemeManifestPropOverride } };
   }
   ```

## Workflow

When adding new functionality:
1. Add doc example in `app/src/docs/_examples`
2. Update page config to link example
3. Create/update explorerConfig for Property Explorer
4. Generate API: `yarn generate-components-api`
5. Test locally at http://localhost:9009/
