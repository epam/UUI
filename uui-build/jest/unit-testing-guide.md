# UUI unit testing guide

## Table of Contents
- [Basics](#basics)
  - [Testing pyramid](#testing-pyramid)
  - [Guiding principles](#guiding-principles)
  - [Writing testable code](#writing-testable-code)
- [Tools](#tools)
  - [Testing Library](#testing-library)
  - [jsdom](#jsdom)
  - [@epam/test-utils](#epamtest-utils)
  - [@testing-library/jest-dom](#testing-libraryjest-dom)
- [Cookbook](#cookbook)
  - [Common mocks](#common-mocks)
  - [Frequent questions](#frequent-questions)
  - [Reference implementation](#reference-implementation)

## Basics

### Testing pyramid
| Level |        Title        | What is tested                                                     | Tools                                                                                                                                                                                                                                   |
|:-----:|:-------------------:|--------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|   1   |      **Unit**       | <ul><li>Pure functions</li><li>Helpers</li><li>Utilities</li></ul> | <ul><li>Jest</li></ul>                                                                                                                                                                                                                  |
|   2   | **Integration** (*) | <ul><li>React component</li><li>Reusable React hook</li></ul>      | <ul><li>Jest + jsdom</li><li>@epam/test-utils</li><li>@testing-library/react</li><li>react-test-renderer (for snapshots)</li><li>@testing-library/jest-dom (custom jest matchers for DOM)</li><li>@testing-library/user-event</li></ul> |
|   3   |    **E2E** (**)     | Not supported in UUI yet.                                          | n/a                                                                                                                                                                                                                                     |
(*) <i>with React components, the distinction between a “unit” and “integration” test can be blurry. For simplicity, we consider that any test of React component is integration one.</i><br/>
(**) <i>such tests require real browser, real api endpoints, layout, navigation, etc.</i>

### Guiding principles
1. Write code which is "testable". Don't try to cover "untestable" code by unit tests - make it "testable" first.
2. Minimize usage of mocks. Reason: with too many mocks, the test no longer resembles the way how component is used.
3. Don't overuse snapshots.
   * Snapshot "*is a*" tool which notifies that *something* is changed without saying whether it's expected change or not.
   * Snapshot "*is not a*" test. It should never replace real tests.
   * It's recommended to add maximum 2 snapshots per component: 
     * snapshot with min amount of props 
     * snapshot with max amount of props.
4. Create tests at the same time (or right after) you create code, if possible. Reasons:
   * It helps to avoid refactoring of already working code to make this code testable. Which means no risk to make a regression.
   * The developer is still "in context" of internal details and corner cases. Which means better quality of tests.
5. Don't strive to reach certain level of test coverage. It's too easy to reach high coverage with poor quality tests. It should only be used to find places which aren't covered by unit tests.
6. Recommended structure of a single test:
   - Arrange - setup any prerequisites (prepare test data, render components, prepare mocks)
   - Act - fire some actions, invoke functions, etc.
   - Assert - verify the result using "expect" statements.
7. It's often useful to create test plan or test matrix before writing any actual tests. It will help to create better tests for a component with minimum effort.

### Writing testable code
1. Follow software development best practices and avoid anti-patterns. Code which follows best practices isn't only maintainable and reliable, but it's also testable.
   * Good: Separation of concerns, Single responsibility, etc.
   * Bad: God object, Spaghetti code, etc.
2. For React components/hooks 
   * Extract complex logic (or logic which you need to cover by unit tests) to pure functions/utils. So that it's possible to test it in isolation (without need to render it, or without need to use complicated/fragile mocks, or without need to depend on any 3rd party libs). 
      - complex state management logic
      - complex calculations
      - formatting, etc
   * Create "unit tests" for the extracted logic.
   * Create "integration tests" for React component. 
   * Create "integration tests" for React hook. But only if this hook is a reusable one (like "useForm"). Otherwise - don't add tests for it.
3. For utils/pure functions:
   * Organize utils by purpose, don't put unrelated logic to the same file. 
   * Choose meaningful names for utils. ```Bad: './utils.ts'``` ```Good: './numberFormattingUtils.ts'```
   * Create "unit tests" for utils.

## Tools

### Testing Library
1. Cheatsheet: https://testing-library.com/docs/react-testing-library/cheatsheet
2. Queries: https://testing-library.com/docs/queries/about Please pay attention to the "Priority" section. And also consider the differences between different types of queries. 
3. Sometimes it's useful to review actual page markup rendered to jsdom. There are next ways to do it:
    ```
    import { screen } from '@testing-library/react';
    // generate link which is helpful to visualize jsdom content
    screen.logTestingPlaygroundURL(); 
    // logs markup to console.
    screen.debug();
    ```
4. Usage of userEvent vs fireEvent: https://testing-library.com/docs/user-event/intro We don't push to use one or another.<br/>The userEvent simulates full interaction, but it's very slow (up to x10 times slower than fireEvent). On the other hand, the fireEvent is very fast, but it doesn't fully resemble the way how user interacts with real page. Choose wisely.
5. Use "within" to limit queries to a specific node: https://testing-library.com/docs/dom-testing-library/api-within
6. Testing appearance & disappearance: https://testing-library.com/docs/guide-disappearance/

### jsdom
* There is no layout in jsdom. The elements don't exist in a specific position, layer and size.
* Usually it's a bad idea to try to mock any layout-related API. It very quickly becomes unmaintainable and fragile. It's better to skip such test or create e2e test instead (if there is such option).
* More info here: https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform

### @epam/test-utils
Prefer using this module instead of direct usage of @testing-library/react or react-test-renderer. Reasons:
* It's built on top of ```@testing-library/react``` and ```react-test-renderer``` and even re-exports certain utils from them. I.e. it's a single module import with access to everything you need to write a test.
* It provides more convenient API to simplify testing of components and hooks.
* It provides custom queries "*ByRoleAndText"
* It provides useful mocks (e.g.: mockReactPortalsForSnapshots, etc.)
* It provides "setupComponentForTest" utility method which simplifies testing of components.

### @testing-library/jest-dom
Provides a set of custom jest matchers to check DOM (element text, classes, state, etc). More info here: https://github.com/testing-library/jest-dom

## Cookbook

### Common mocks
1. "react-popper"<br />
This 3rd party component is used in "Dropdown". As well as in other components which use dropdown internally (e.g. "DatePicker", etc.).<br/>
The component heavily relies on "layout" features of browser and therefore, we need to mock it in jsdom.
    ```javascript
    jest.mock('react-popper', () => ({
        ...jest.requireActual('react-popper'),
        Popper: function PopperMock({ children }: any) {
            return children({
                ref: jest.fn, update: jest.fn(), style: {}, arrowProps: { ref: jest.fn }, placement: 'bottom-start', isReferenceHidden: false,
            });
        },
    }));
    ```

2. react portal (for snapshots only)<br />
It's needed only for snapshots. Use it for components which use React portals internally.
    ```javascript
    it('should render with maximum props', async () => {
        const portalMock = mockReactPortalsForSnapshots();
        //
        const tree = await renderSnapshotWithContextAsync(<Test />);
        //
        portalMock.mockClear();
        expect(tree).toMatchSnapshot();
    });
    ```

### Frequent questions
1. Q: How to fix errors like this? *Warning: An update to <component> inside a test was not wrapped in act*<br/>
   A: Good summary is here: https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
2. Q: How do I test only part of the object/array?<br/>
   A: Use partial matchers like "objectContaining", "arrayContaining", etc. More details here: https://jestjs.io/docs/expect#expectobjectcontainingobject E.g.:<br />
      ```javascript
      expect(mocks.setTableState).lastCalledWith(expect.objectContaining({ filter: { position: [2, 3] } }));
      ```
3. Q: How to test component which requires svg as an input?<br/>
   A: Use SvgMock:
    ```jsx 
    import { SvgMock } from '@epam/test-utils';
    // ...
    <Test icon={ SvgMock } />
    ```
4. Q: Can I use DOM api such as querySelector for testing?<br/>
   A: It's strongly not recommended. Such tests are fragile, e.g. it may fail after some internal changes which doesn't affect functionality of the component (e.g. css class renaming).<br />
      Try other options instead, e.g.: adjust internal implementation of the component (assign role, add title, add label, etc.) or add "data-testid" attribute (less preferrable).
5. Q: How can I add *data\-testid* attribute to UUI component?<br/>
   A: Use "rawProps". E.g.:
    ```jsx
    <Test rawProps={ { 'data-testid': '...' } } />
    ```
6. Q: How can I test a use cases like this:
      - when props which are passed to the component are changed from outside (without unmounting the component)
      - on-change workflow, when a callback prop (e.g. "onValueChange") updates some other props (e.g. "value")<br />

   A: Use "setupComponentForTest". E.g.:<br />
    ```typescript jsx
    // File: testComponent.tsx
    // Let's say we want to test a component like this
    export interface TestComponentProps {
        value: string;
        onValueChange: (value: string) => void;
    }
    export function TestComponent(props: TestComponentProps) {
        return (
            <TextInput value={ props.value } onValueChange={ props.onValueChange } />
        );
    }
    ```
    ```typescript jsx
    // File testComponent.test.tsx
    import { setupComponentForTest } from '@epam/test-utils';
    async function setupTestComponent(params: Partial<TestComponentProps>) {
        const { mocks, setProps } = await setupComponentForTest<DatePickerProps>(
            (context) => ({
                value: params.value,
                onValueChange: jest.fn().mockImplementation((newValue) => {
                    context.current.setProperty('value', newValue);
                }),
            }),
            (props) => <TestComponent { ...props } />,
        );
        const input = screen.queryByRole('textbox') as HTMLInputElement;
        const dom = { input };
        return {
            setProps,
            mocks,
            dom,
        };
    }
    describe('TestComponent', () => {
        it('should change displayed value when props changed', async () => {
            const { setProps, mocks, dom } = await setupTestComponent({ value: 'monday' });
            // ...
            expect(dom.input.value).toEqual('monday');
            setProps({ value: 'tuesday' });
            expect(dom.input.value).toEqual('tuesday');
            expect(mocks.onValueChange).not.toHaveBeenCalled();
        });
    });
    ```

### Reference implementation
- (fake timers) ```uui-core/src/helpers/\__tests__/IEditableDebouncer.test.tsx``` 
- (make component testable by extracting state management logic) ```uui-components/src/table/columnsConfigurationModal/\__tests__/columnsConfigurationActions.test.ts``` 
- (react-popper mock usage) ```uui/components/datePickers/\__tests__/DatePicker.test.tsx```
- (snapshot) ```uui/components/inputs/\__tests__/NumericInput.test.tsx```
- (complex component) ```uui/components/filters/\__tests__/filtersPanel.test.tsx``` 
- (complex component, adaptive panel mock) ```uui/components/filters/PresetPanel/\__tests__/presetsPanel.test.tsx```
- (complex component) ```uui/components/pickers/\__tests__/PickerInput.test.tsx```
- ("data-testid" usage) ```uui-components/src/adaptivePanel/\__tests__/adaptivePanel.test.tsx``` 
