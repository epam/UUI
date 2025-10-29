## Update UUI Documentation
When you add new functionality or change an API, you need to update our documentation.
All UUI documentation is published on [uui.epam.com](https://uui.epam.com/); the sources are in the `./app` folder.

Below you can find instructions how to add Doc Example and update component property explorer page.


### Add a doc example

1. Go to `app/src/docs/_examples` and open/add a folder for the component you want to document.
2. Add an example with the following file name pattern: `example-name.example.tsx`.
3. Go to `app/src/docs/pages`, find/add the appropriate page config file, and add a link to your example on the doc page:
    ```
      { "name": "Basic", "componentPath": "alert/Basic.example.tsx" },
   ```
4. If you add a new documents page, update `app/src/documents/structure.ts` to add your page to the sidebar menu.
5. In your browser, open the local environment of the UUI site (http://localhost:3793/), navigate to your page, and add the example description via the RTE field.

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