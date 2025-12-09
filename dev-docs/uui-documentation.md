## Update UUI Documentation
When you add new functionality or change an API, you need to update our documentation.
All UUI documentation is published on [uui.epam.com](https://uui.epam.com/); the sources are in the `./app` folder.

Below, you can find instructions on how to add Doc Example and update component property explorer page.


### Add a doc example

1. Go to `app/src/docs/_examples` and open/add a folder for the component you want to document.
2. Add an example with the following file name pattern: `example-name.example.tsx`.
3. Go to `app/src/docs/pages`, find/add the appropriate page config file, and add a link to your example on the doc page:
    ```
      { "name": "Basic", "componentPath": "alert/Basic.example.tsx" },
   ```
4. If you add a new documents page, update `app/src/documents/structure.ts` to add your page to the sidebar menu.
5. In your browser, open the local environment of the UUI site (http://localhost:9009/), navigate to your page, and add the example description via the RTE field.

### Property Explorer

We use Property Explorer to test components in different variations of props. You can find the Property Explorer tab on each component's documentation page.

Most Property Explorer content is automatically generated from component prop type metadata (produced by `yarn generate-components-api`).
You still need to create an `explorerConfig` and connect it to the doc page. Sometimes you may want to override the default editor for a prop.

#### Add and update editorConfig
1. Go to the `app/src/docs/explorerConfigs` folder and find/add the appropriate config file.
   - Use the same id as the id of the page config (`app/src/docs/pages`) where this PE should be connected.
   - Add contexts in which the component can be displayed: `contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form, TDocContext.Table],`
   - Define `bySkin` mapping to link the component with its prop interface:
     ```
      bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:TextInputProps', component: uui.TextInput },
        [TSkin.Loveship]: { type: '@epam/uui:TextInputProps', component: loveship.TextInput },
        [TSkin.Promo]: { type: '@epam/uui:TextInputProps', component: promo.TextInput },
        [TSkin.Electric]: { type: '@epam/uui:TextInputProps', component: electric.TextInput },
      },
     ```

2. (Optional) Change defaults of prop editor via `doc` method
    ```
    doc: (doc: DocBuilder<uui.TextInputProps>) => {
        doc.merge('type', { defaultValue: 'text' });
        doc.merge('mode', { defaultValue: 'form' });
        doc.merge('iconPosition', { defaultValue: 'left' });
        doc.merge('maxLength', { examples: [10, 20, 30] });
    },
   ```
3. (Optional) Define preview pages for screenshot testing: TBD

#### API Block

The Component API section is generated based on component prop interfaces. You don't need to regenerate it locally — it's part of the deployment steps.

To update this block locally, run `yarn generate-components-api` in the project root.

### Use external theme
UUI documentation allows you to connect external themes (not stored into UUI repo).

1. Add a `uui-custom-themes` object to `localStorage` containing a list of URLs for custom themes:
    ```
        localStorage.setItem(
        'uui-custom-themes', 
            JSON.stringify({
                customThemes: [
                    "https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/themes/custom-theme-1",
                    "https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/themes/custom-theme-2",
                ]
            })
        )
    ```
   
2. The custom theme URL must serve a theme manifest file at the path /theme-manifest.json. 
   This manifest should adhere to the following structure:
   ```
       export interface IThemeManifest {
           /*
            * Unique ID of the custom theme.
            */
           id: string;
   
           /*
            * Theme display name. Visible to end users in theme selector.
            */
           name: string;
   
            /* A list of CSS files required for this theme.
             * Example: ['custom-theme-1.css']
             * These CSS files should be served relative to the custom theme URL 
             * (e.g., '/custom-theme-1.css').
             */
           css: string[];
   
            /* A settings file to customize the default sizing of UUI components.
             * Example: 'custom-theme-settings.json'
             * This JSON file should be served relative to the custom theme URL 
             * (e.g., '/custom-theme-settings.json').
             */
           settings?: string | null;
   
           /*
            * Any overrides for the "property explorer"
            */
           propsOverride?: {
               [typeRef: `${string}:${string}`]: {
                   [propName: string]: IThemeManifestPropOverride;
               }
           };
       }
    
       export interface IThemeManifestPropOverride {
           editor: {
               type: 'oneOf',
               options: (string | number)[],
           },
           comment?: {
               tags?: {
               '@default': string
               }
           },
       }
   ```
   
Note: The recommended way to store theme artifacts is via a CDN, as they are purely static files.